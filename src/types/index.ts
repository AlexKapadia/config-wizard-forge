
export interface Parameter {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  units: string;
  defaultValue: number | null;
  value: number | null;
  description: string;
}

export interface Calculation {
  id: string;
  name: string;
  formula: string;
  units: string;
  description: string;
  value?: number;
}

export type Patch =
  | { action: "update"; id: string; field: "value" | "formula" | "description"; newValue: any }
  | { action: "create"; entity: "calculation"; payload: Calculation };

export interface HierarchyLevel {
  id: string;
  name: string;
  description: string;
}

export interface Hierarchy {
  industryId?: string;
  technologyId?: string;
  solutionId?: string;
  variantId?: string;
}

export interface DeepSeekResponse {
  answer: string;
  patch?: Patch[];
  descriptionDraft?: string;
}
