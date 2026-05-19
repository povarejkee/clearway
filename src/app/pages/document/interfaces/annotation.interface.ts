import { TAnnotation } from '../types';

export interface IAnnotation {
  id: string;
  type: TAnnotation;
  x: number;
  y: number;
  content: string;
}
