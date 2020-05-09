import { Diagnosis } from './Diagnosis';
import { Ward } from './Ward';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  diagnosis: Diagnosis;
  ward: Ward;
}
