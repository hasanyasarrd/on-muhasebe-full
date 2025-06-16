export interface Person {
  id?: number; // ✅ opsiyonel olmalı
  name: string;
  role: string;
  monthlyCost: number;
}

export interface Project {
  id?: number; // ✅ opsiyonel olmalı
  name: string;
  startDate: string;
  endDate: string;
  monthlyIncome: number;
}


// ProjectPerson Model
export interface ProjectPerson {
  id: number;
  personId: number;
  projectId: number;
  personName?: string;
  projectName?: string;
}

// DTOs
export interface ProjectPersonDTO {
  personId: number;
  projectId: number;
}

export interface ProjectSummaryDTO {
  projectName: string;
  monthlyIncome: number;
  monthlyCost: number;
  monthlyProfit: number;
}

export interface ProjectWithPersonsDTO {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  monthlyIncome: number;
  personNames: string[];
}

// Response Models
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AssignmentResponse {
  success: boolean;
  message: string;
  id?: number;
  personName?: string;
  projectName?: string;
}

// Type Guards (Tip Kontrolü için)
export function isValidProject(obj: any): obj is Project {
  return obj &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.monthlyIncome === 'number';
}

export function isValidPerson(obj: any): obj is Person {
  return obj &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.monthlyCost === 'number';
}
