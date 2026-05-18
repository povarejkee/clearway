import { Injectable } from '@angular/core';
import { IDocument, IDocumentPage } from '../interfaces/document.interface';

@Injectable({ providedIn: 'root' })
export class CoreService {
  public prepareDocument(doc: IDocument): IDocument {
    return {
      ...doc,
      pages: doc.pages.map((page: IDocumentPage) => ({
        ...page,
        imageUrl: `/documents/${page.imageUrl}`,
      })),
    };
  }
}
