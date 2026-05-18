import { AnnotationType } from '../types';

export interface IDocumentPage {
  number: number;
  imageUrl: string;
  annotations: IAnnotation[];
}

export interface IDocument {
  name: string;
  pages: IDocumentPage[];
}

export interface IAnnotation {
  id: string;
  type: AnnotationType;
  x: number;
  y: number;
  content: string;
}
