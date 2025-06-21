
import { Parameter } from '../types';

export const tcoParameters: Parameter[] = [
  // CAPEX Parameters
  {
    id: 'equipment_cost',
    name: 'Equipment Cost',
    level: 1,
    units: '$',
    defaultValue: 100000,
    value: null,
    description: 'Initial cost of equipment and hardware'
  },
  {
    id: 'installation_cost',
    name: 'Installation Cost',
    level: 1,
    units: '$',
    defaultValue: 25000,
    value: null,
    description: 'Cost of installation and setup'
  },
  {
    id: 'commissioning_cost',
    name: 'Commissioning Cost',
    level: 1,
    units: '$',
    defaultValue: 15000,
    value: null,
    description: 'Cost of testing and commissioning'
  },
  // OPEX Parameters
  {
    id: 'energy_cost',
    name: 'Annual Energy Cost',
    level: 1,
    units: '$/year',
    defaultValue: 50000,
    value: null,
    description: 'Annual electricity and energy costs'
  },
  {
    id: 'maintenance_cost',
    name: 'Annual Maintenance Cost',
    level: 1,
    units: '$/year',
    defaultValue: 12000,
    value: null,
    description: 'Annual maintenance and servicing costs'
  },
  {
    id: 'labor_cost',
    name: 'Annual Labor Cost',
    level: 1,
    units: '$/year',
    defaultValue: 80000,
    value: null,
    description: 'Annual operational labor costs'
  },
  // ROI Parameters
  {
    id: 'annual_savings',
    name: 'Annual Savings',
    level: 1,
    units: '$/year',
    defaultValue: 75000,
    value: null,
    description: 'Annual cost savings from the system'
  }
];
