import { Injectable } from '@angular/core';
import { IDocument, IDocumentPage } from '../interfaces/document.interface';

@Injectable()
export class CoreService {
  public transformDocument(doc: IDocument): IDocument {
    return {
      ...doc,
      pages: doc.pages.map((page: IDocumentPage) => ({
        ...page,
        imageUrl: `/documents/${page.imageUrl}`,
      })),
    };
  }
}
