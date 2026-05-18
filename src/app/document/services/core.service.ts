import { Injectable } from '@angular/core';
import { IAnnotation, IDocument, IDocumentPage } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class CoreService {
  public prepareDocument(doc: IDocument): IDocument {
    return {
      ...doc,
      pages: doc.pages.map((page: IDocumentPage) => ({
        ...page,
        imageUrl: `/documents/${page.imageUrl}`,
        annotations: [] as IAnnotation[],
      })),
    };
  }
}
