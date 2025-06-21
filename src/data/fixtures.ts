
import { v4 as uuidv4 } from 'uuid';
import { Parameter, HierarchyLevel } from '../types';

export const industries: HierarchyLevel[] = [
  { id: 'datacenter', name: 'Data Centre', description: 'Mission-critical computing infrastructure' },
  { id: 'manufacturing', name: 'Manufacturing', description: 'Industrial production facilities' },
  { id: 'healthcare', name: 'Healthcare', description: 'Medical and pharmaceutical facilities' }
];

export const technologies: Record<string, HierarchyLevel[]> = {
  datacenter: [
    { id: 'cooling', name: 'Cooling Systems', description: 'Temperature and humidity control' },
    { id: 'power', name: 'Power Distribution', description: 'Electrical power management' },
    { id: 'monitoring', name: 'Environmental Monitoring', description: 'Real-time facility monitoring' }
  ]
};

export const solutions: Record<string, HierarchyLevel[]> = {
  cooling: [
    { id: 'air-cooling', name: 'Air Cooling', description: 'Traditional air-based cooling systems' },
    { id: 'liquid-cooling', name: 'Liquid Cooling', description: 'Direct liquid cooling solutions' },
    { id: 'hybrid-cooling', name: 'Hybrid Cooling', description: 'Combined air and liquid cooling' }
  ]
};

export const variants: Record<string, HierarchyLevel[]> = {
  'air-cooling': [
    { id: 'crac', name: 'CRAC Units', description: 'Computer Room Air Conditioning' },
    { id: 'crah', name: 'CRAH Units', description: 'Computer Room Air Handling' },
    { id: 'inrow', name: 'InRow Cooling', description: 'Close-coupled cooling solutions' }
  ]
};

export const sampleParameters: Parameter[] = [
  // Level 1 - Industry
  {
    id: uuidv4(),
    name: 'Facility Size',
    level: 1,
    units: 'm²',
    defaultValue: 1000,
    value: null,
    description: 'Total facility floor area'
  },
  {
    id: uuidv4(),
    name: 'Operating Hours',
    level: 1,
    units: 'hours/day',
    defaultValue: 24,
    value: null,
    description: 'Daily operational hours'
  },
  
  // Level 2 - Technology
  {
    id: uuidv4(),
    name: 'Cooling Load',
    level: 2,
    units: 'kW',
    defaultValue: 500,
    value: null,
    description: 'Total heat load to be removed'
  },
  {
    id: uuidv4(),
    name: 'Temperature Setpoint',
    level: 2,
    units: '°C',
    defaultValue: 22,
    value: null,
    description: 'Target temperature for cooling system'
  },
  {
    id: uuidv4(),
    name: 'Humidity Setpoint',
    level: 2,
    units: '%RH',
    defaultValue: 45,
    value: null,
    description: 'Target relative humidity'
  },
  
  // Level 3 - Solution
  {
    id: uuidv4(),
    name: 'Air Flow Rate',
    level: 3,
    units: 'm³/min',
    defaultValue: 1200,
    value: null,
    description: 'Required air circulation rate'
  },
  {
    id: uuidv4(),
    name: 'Supply Air Temperature',
    level: 3,
    units: '°C',
    defaultValue: 18,
    value: null,
    description: 'Temperature of air supplied to space'
  },
  {
    id: uuidv4(),
    name: 'Delta T',
    level: 3,
    units: 'K',
    defaultValue: 8,
    value: null,
    description: 'Temperature difference between supply and return air'
  },
  
  // Level 4 - Variant
  {
    id: uuidv4(),
    name: 'Unit Capacity',
    level: 4,
    units: 'kW',
    defaultValue: 25,
    value: null,
    description: 'Cooling capacity per unit'
  },
  {
    id: uuidv4(),
    name: 'Number of Units',
    level: 4,
    units: 'units',
    defaultValue: 20,
    value: null,
    description: 'Total number of cooling units'
  },
  {
    id: uuidv4(),
    name: 'Power Consumption',
    level: 4,
    units: 'kW',
    defaultValue: 8,
    value: null,
    description: 'Electrical power consumption per unit'
  }
];
