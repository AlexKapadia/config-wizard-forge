
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
  ],
  manufacturing: [
    { id: 'automation', name: 'Industrial Automation', description: 'Process control and automation systems' },
    { id: 'safety', name: 'Safety Systems', description: 'Industrial safety and protection systems' },
    { id: 'quality', name: 'Quality Control', description: 'Product quality monitoring and control' }
  ],
  healthcare: [
    { id: 'hvac', name: 'HVAC Systems', description: 'Hospital climate control systems' },
    { id: 'medical-gas', name: 'Medical Gas Systems', description: 'Medical gas distribution and monitoring' },
    { id: 'sterilization', name: 'Sterilization Systems', description: 'Medical equipment sterilization' }
  ]
};

export const solutions: Record<string, HierarchyLevel[]> = {
  // Data Center Cooling Solutions
  cooling: [
    { id: 'air-cooling', name: 'Air Cooling', description: 'Traditional air-based cooling systems' },
    { id: 'liquid-cooling', name: 'Liquid Cooling', description: 'Direct liquid cooling solutions' },
    { id: 'hybrid-cooling', name: 'Hybrid Cooling', description: 'Combined air and liquid cooling' }
  ],
  // Data Center Power Solutions
  power: [
    { id: 'ups-systems', name: 'UPS Systems', description: 'Uninterruptible power supply solutions' },
    { id: 'pdu-systems', name: 'PDU Systems', description: 'Power distribution unit systems' },
    { id: 'backup-generators', name: 'Backup Generators', description: 'Emergency power generation' }
  ],
  // Data Center Monitoring Solutions
  monitoring: [
    { id: 'environmental', name: 'Environmental Monitoring', description: 'Temperature, humidity, and air quality monitoring' },
    { id: 'power-monitoring', name: 'Power Monitoring', description: 'Electrical power consumption monitoring' },
    { id: 'security', name: 'Security Monitoring', description: 'Access control and surveillance systems' }
  ],
  // Manufacturing Automation Solutions
  automation: [
    { id: 'plc-systems', name: 'PLC Systems', description: 'Programmable logic controller systems' },
    { id: 'scada', name: 'SCADA Systems', description: 'Supervisory control and data acquisition' },
    { id: 'robotics', name: 'Industrial Robotics', description: 'Automated manufacturing robotics' }
  ],
  // Manufacturing Safety Solutions
  safety: [
    { id: 'fire-suppression', name: 'Fire Suppression', description: 'Industrial fire prevention and suppression' },
    { id: 'gas-detection', name: 'Gas Detection', description: 'Hazardous gas monitoring systems' },
    { id: 'emergency-shutdown', name: 'Emergency Shutdown', description: 'Emergency process shutdown systems' }
  ],
  // Manufacturing Quality Solutions
  quality: [
    { id: 'vision-systems', name: 'Vision Systems', description: 'Automated visual inspection systems' },
    { id: 'measurement', name: 'Measurement Systems', description: 'Precision measurement and calibration' },
    { id: 'testing', name: 'Testing Systems', description: 'Automated product testing systems' }
  ],
  // Healthcare HVAC Solutions
  hvac: [
    { id: 'operating-room', name: 'Operating Room HVAC', description: 'Sterile environment climate control' },
    { id: 'isolation-room', name: 'Isolation Room HVAC', description: 'Negative pressure isolation systems' },
    { id: 'pharmacy', name: 'Pharmacy HVAC', description: 'Pharmaceutical storage climate control' }
  ],
  // Healthcare Medical Gas Solutions
  'medical-gas': [
    { id: 'oxygen-systems', name: 'Oxygen Systems', description: 'Medical oxygen distribution systems' },
    { id: 'vacuum-systems', name: 'Vacuum Systems', description: 'Medical vacuum and suction systems' },
    { id: 'anesthesia-gas', name: 'Anesthesia Gas', description: 'Anesthetic gas delivery systems' }
  ],
  // Healthcare Sterilization Solutions
  sterilization: [
    { id: 'steam-sterilization', name: 'Steam Sterilization', description: 'Autoclave sterilization systems' },
    { id: 'ethylene-oxide', name: 'Ethylene Oxide', description: 'ETO sterilization systems' },
    { id: 'hydrogen-peroxide', name: 'Hydrogen Peroxide', description: 'Vaporized hydrogen peroxide sterilization' }
  ]
};

export const variants: Record<string, HierarchyLevel[]> = {
  // Air Cooling Variants
  'air-cooling': [
    { id: 'crac', name: 'CRAC Units', description: 'Computer Room Air Conditioning' },
    { id: 'crah', name: 'CRAH Units', description: 'Computer Room Air Handling' },
    { id: 'inrow', name: 'InRow Cooling', description: 'Close-coupled cooling solutions' }
  ],
  // Liquid Cooling Variants
  'liquid-cooling': [
    { id: 'direct-liquid', name: 'Direct Liquid Cooling', description: 'Direct-to-chip liquid cooling' },
    { id: 'immersion', name: 'Immersion Cooling', description: 'Full immersion liquid cooling' },
    { id: 'rear-door', name: 'Rear Door Heat Exchangers', description: 'Passive rear door cooling' }
  ],
  // Hybrid Cooling Variants
  'hybrid-cooling': [
    { id: 'air-liquid-hybrid', name: 'Air-Liquid Hybrid', description: 'Combined air and liquid cooling' },
    { id: 'economizer', name: 'Economizer Systems', description: 'Free cooling with backup systems' },
    { id: 'evaporative', name: 'Evaporative Cooling', description: 'Evaporative cooling systems' }
  ],
  // UPS System Variants
  'ups-systems': [
    { id: 'online-ups', name: 'Online UPS', description: 'Double conversion online UPS systems' },
    { id: 'line-interactive', name: 'Line Interactive UPS', description: 'Line interactive UPS systems' },
    { id: 'modular-ups', name: 'Modular UPS', description: 'Scalable modular UPS systems' }
  ],
  // PDU System Variants
  'pdu-systems': [
    { id: 'basic-pdu', name: 'Basic PDU', description: 'Basic power distribution units' },
    { id: 'metered-pdu', name: 'Metered PDU', description: 'Power monitoring PDUs' },
    { id: 'switched-pdu', name: 'Switched PDU', description: 'Remote switching PDUs' }
  ],
  // Backup Generator Variants
  'backup-generators': [
    { id: 'diesel-generator', name: 'Diesel Generators', description: 'Diesel-powered backup generators' },
    { id: 'natural-gas', name: 'Natural Gas Generators', description: 'Natural gas backup generators' },
    { id: 'fuel-cell', name: 'Fuel Cell Systems', description: 'Hydrogen fuel cell backup power' }
  ],
  // Environmental Monitoring Variants
  'environmental': [
    { id: 'wireless-sensors', name: 'Wireless Sensors', description: 'Wireless environmental monitoring' },
    { id: 'wired-sensors', name: 'Wired Sensors', description: 'Hardwired sensor networks' },
    { id: 'iot-sensors', name: 'IoT Sensors', description: 'Internet of Things sensor systems' }
  ],
  // Power Monitoring Variants
  'power-monitoring': [
    { id: 'smart-meters', name: 'Smart Meters', description: 'Intelligent power metering systems' },
    { id: 'power-analyzers', name: 'Power Analyzers', description: 'Advanced power quality analyzers' },
    { id: 'energy-management', name: 'Energy Management', description: 'Comprehensive energy management systems' }
  ],
  // Security Monitoring Variants
  'security': [
    { id: 'access-control', name: 'Access Control', description: 'Electronic access control systems' },
    { id: 'surveillance', name: 'Surveillance Systems', description: 'Video surveillance and monitoring' },
    { id: 'intrusion-detection', name: 'Intrusion Detection', description: 'Perimeter intrusion detection' }
  ],
  // Add more variants for other solutions as needed...
  // For brevity, I'll add a few more key ones
  'plc-systems': [
    { id: 'compact-plc', name: 'Compact PLC', description: 'Small form factor PLCs' },
    { id: 'modular-plc', name: 'Modular PLC', description: 'Expandable modular PLC systems' },
    { id: 'safety-plc', name: 'Safety PLC', description: 'Safety-rated PLC systems' }
  ],
  'operating-room': [
    { id: 'laminar-flow', name: 'Laminar Flow Systems', description: 'Unidirectional air flow systems' },
    { id: 'hepa-filtration', name: 'HEPA Filtration', description: 'High-efficiency particulate air filtration' },
    { id: 'pressure-control', name: 'Pressure Control', description: 'Positive pressure control systems' }
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
