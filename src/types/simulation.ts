import { ValuationRecord } from '../types/valuation';

export type SimulationScenario = {
  id: string;
  name: string;
  baseRecordId?: string;
  inputs: Partial<ValuationRecord>;
  scoreDelta: number;
  riskFlags: string[];
  createdAt: number;
};
