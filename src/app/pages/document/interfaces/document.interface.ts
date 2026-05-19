import { IAnnotation } from './annotation.interface';

export interface IDocumentPage {
  number: number;
  imageUrl: string;
  annotations: IAnnotation[];
}

export interface IDocument {
  name: string;
  pages: IDocumentPage[];
}
