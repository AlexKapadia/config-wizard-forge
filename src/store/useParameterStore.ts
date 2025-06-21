
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { evaluate } from 'mathjs';
import { Parameter, Calculation, Patch, Hierarchy } from '../types';
import { sampleParameters } from '../data/fixtures';

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
      parameters: sampleParameters,
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
          
          return { hierarchy: newHierarchy };
        });
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
