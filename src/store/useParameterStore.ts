import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { evaluate } from 'mathjs';
import { Parameter, Calculation, Patch, Hierarchy } from '../types';
import { sampleParameters } from '../data/fixtures';
import { tcoParameters } from '../data/tco-parameters';

// Level-specific calculation templates
const levelCalculations: Record<1 | 2 | 3 | 4, Array<Omit<Calculation, 'value'>>> = {
  1: [ // Industry level - TCO calculations (generic across all industries)
    {
      id: 'tco-capex',
      name: 'Total CAPEX',
      formula: 'equipment_cost + installation_cost + commissioning_cost',
      units: '$',
      description: 'Total Capital Expenditure for the system'
    },
    {
      id: 'tco-opex-annual',
      name: 'Annual OPEX',
      formula: 'energy_cost + maintenance_cost + labor_cost',
      units: '$/year',
      description: 'Annual Operating Expenditure'
    },
    {
      id: 'tco-total-5yr',
      name: '5-Year TCO',
      formula: 'tco-capex + (tco-opex-annual * 5)',
      units: '$',
      description: 'Total Cost of Ownership over 5 years'
    },
    {
      id: 'tco-payback',
      name: 'Payback Period',
      formula: 'tco-capex / annual_savings',
      units: 'years',
      description: 'Time to recover initial investment'
    }
  ],
  2: [ // Technology level - Performance calculations
    {
      id: 'efficiency-overall',
      name: 'Overall Efficiency',
      formula: 'useful_output / total_input * 100',
      units: '%',
      description: 'Overall system efficiency percentage'
    },
    {
      id: 'capacity-utilization',
      name: 'Capacity Utilization',
      formula: 'actual_output / rated_capacity * 100',
      units: '%',
      description: 'How much of rated capacity is being used'
    }
  ],
  3: [ // Solution level - Operational calculations
    {
      id: 'throughput-rate',
      name: 'Throughput Rate',
      formula: 'total_volume / operating_hours',
      units: 'units/hr',
      description: 'Rate of processing or production'
    },
    {
      id: 'availability-factor',
      name: 'Availability Factor',
      formula: 'uptime_hours / total_hours * 100',
      units: '%',
      description: 'System availability percentage'
    }
  ],
  4: [ // Variant level - Specific performance metrics
    {
      id: 'power-density',
      name: 'Power Density',
      formula: 'total_power / floor_area',
      units: 'kW/m²',
      description: 'Power consumption per unit area'
    },
    {
      id: 'cooling-efficiency',
      name: 'Cooling Efficiency',
      formula: 'cooling_load / power_consumption',
      units: 'kW/kW',
      description: 'Cooling delivered per unit power consumed'
    }
  ]
};

interface ParameterStoreState {
  hierarchy: Hierarchy;
  parameters: Parameter[];
  calculations: Calculation[];
  patches: Patch[];
  currentStep: number;
  
  // Actions
  setHierarchy: (level: number, id: string) => void;
  applyPatch: (patch: Patch | Patch[]) => void;
  rollback: (idx?: number) => void;
  commitPatches: () => void;
  recalc: () => void;
  resetParam: (id: string) => void;
  setCurrentStep: (step: number) => void;
  updateParameter: (id: string, field: keyof Parameter, value: any) => void;
  updateCalculation: (id: string, field: keyof Calculation, value: any) => void;
  addCalculation: (calculation: Calculation) => void;
  removeCalculation: (id: string) => void;
}

export const useParameterStore = create<ParameterStoreState>()(
  persist(
    (set, get) => ({
      hierarchy: {},
      parameters: [...sampleParameters, ...tcoParameters],
      calculations: [],
      patches: [],
      currentStep: 1,

      setHierarchy: (level: number, id: string) => {
        set((state) => {
          const newHierarchy = { ...state.hierarchy };
          
          if (level === 1) newHierarchy.industryId = id;
          if (level === 2) newHierarchy.technologyId = id;
          if (level === 3) newHierarchy.solutionId = id;
          if (level === 4) newHierarchy.variantId = id;
          
          // Add level-specific calculations
          const newCalculations = [...state.calculations];
          const levelKey = level as 1 | 2 | 3 | 4;
          const levelCalcs = levelCalculations[levelKey] || [];
          
          // Remove existing calculations for this level and higher levels
          const filteredCalculations = newCalculations.filter(calc => {
            const calcLevel = Object.keys(levelCalculations).find(l => 
              levelCalculations[parseInt(l) as 1 | 2 | 3 | 4].some(lc => lc.id === calc.id)
            );
            return !calcLevel || parseInt(calcLevel) < level;
          });
          
          // Add new calculations for selected level
          levelCalcs.forEach(calc => {
            if (!filteredCalculations.some(existing => existing.id === calc.id)) {
              filteredCalculations.push({ ...calc });
            }
          });
          
          return { 
            hierarchy: newHierarchy,
            calculations: filteredCalculations
          };
        });
        
        // Trigger recalculation
        get().recalc();
      },

      applyPatch: (patch: Patch | Patch[]) => {
        const patches = Array.isArray(patch) ? patch : [patch];
        
        set((state) => {
          const newState = { ...state };
          
          patches.forEach((p) => {
            if (p.action === 'update') {
              const paramIndex = newState.parameters.findIndex(param => param.id === p.id);
              if (paramIndex !== -1) {
                newState.parameters[paramIndex] = {
                  ...newState.parameters[paramIndex],
                  [p.field]: p.newValue
                };
              }
              
              const calcIndex = newState.calculations.findIndex(calc => calc.id === p.id);
              if (calcIndex !== -1) {
                newState.calculations[calcIndex] = {
                  ...newState.calculations[calcIndex],
                  [p.field]: p.newValue
                };
              }
            } else if (p.action === 'create' && p.entity === 'calculation') {
              newState.calculations.push(p.payload);
            }
          });
          
          return {
            ...newState,
            patches: [...state.patches, ...patches]
          };
        });
        
        // Trigger recalculation
        get().recalc();
      },

      rollback: (idx?: number) => {
        set((state) => {
          const targetIndex = idx ?? state.patches.length - 1;
          if (targetIndex < 0) return state;
          
          return {
            ...state,
            patches: state.patches.slice(0, targetIndex)
          };
        });
      },

      commitPatches: () => {
        set((state) => ({ ...state, patches: [] }));
      },

      recalc: () => {
        set((state) => {
          const updatedCalculations = state.calculations.map(calc => {
            try {
              // Replace parameter names in formula with actual values
              let formula = calc.formula;
              state.parameters.forEach(param => {
                const value = param.value ?? param.defaultValue ?? 0;
                formula = formula.replace(new RegExp(param.id, 'g'), value.toString());
              });
              
              // Replace calculation references with their values
              state.calculations.forEach(otherCalc => {
                if (otherCalc.id !== calc.id && otherCalc.value !== undefined) {
                  formula = formula.replace(new RegExp(otherCalc.id, 'g'), otherCalc.value.toString());
                }
              });
              
              const result = evaluate(formula);
              return { ...calc, value: typeof result === 'number' ? result : undefined };
            } catch (error) {
              console.error(`Error calculating ${calc.name}:`, error);
              return { ...calc, value: undefined };
            }
          });
          
          return { ...state, calculations: updatedCalculations };
        });
      },

      resetParam: (id: string) => {
        set((state) => ({
          ...state,
          parameters: state.parameters.map(param =>
            param.id === id ? { ...param, value: null } : param
          )
        }));
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      updateParameter: (id: string, field: keyof Parameter, value: any) => {
        set((state) => ({
          ...state,
          parameters: state.parameters.map(param =>
            param.id === id ? { ...param, [field]: value } : param
          )
        }));
      },

      updateCalculation: (id: string, field: keyof Calculation, value: any) => {
        set((state) => ({
          ...state,
          calculations: state.calculations.map(calc =>
            calc.id === id ? { ...calc, [field]: value } : calc
          )
        }));
      },

      addCalculation: (calculation: Calculation) => {
        set((state) => ({
          ...state,
          calculations: [...state.calculations, calculation]
        }));
      },

      removeCalculation: (id: string) => {
        set((state) => ({
          ...state,
          calculations: state.calculations.filter(calc => calc.id !== id)
        }));
      }
    }),
    {
      name: 'parameter-store',
      partialize: (state) => ({
        hierarchy: state.hierarchy,
        parameters: state.parameters,
        calculations: state.calculations,
        currentStep: state.currentStep
      })
    }
  )
);
