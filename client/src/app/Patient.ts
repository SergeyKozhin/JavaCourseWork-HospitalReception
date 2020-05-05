import {Diagnosis} from './Diagnosis';
import {Ward} from './Ward';

export interface Patient {
  id: bigint;
  firstName: string;
  lastName: string;
  fatherName: string;
  diagnosis: Diagnosis;
  ward: Ward;
}
