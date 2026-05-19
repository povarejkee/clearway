import { Injectable } from '@angular/core';
import { IAnnotation } from '../interfaces/annotation.interface';
import { IDocument, IDocumentPage } from '../interfaces/document.interface';

@Injectable()
export class CoreService {
  public transformDocument(doc: IDocument): IDocument {
    return {
      ...doc,
      pages: doc.pages.map((page: IDocumentPage) => ({
        ...page,
        imageUrl: `/documents/${page.imageUrl}`,
        annotations: [] as IAnnotation[],
      })),
    };
  }

  public patchPageAnnotations(
    doc: IDocument,
    pageNumber: number,
    patch: (annotations: IAnnotation[]) => IAnnotation[],
  ): IDocument {
    return {
      ...doc,
      pages: doc.pages.map((page: IDocumentPage): IDocumentPage => {
        return page.number === pageNumber
          ? { ...page, annotations: patch(page.annotations) }
          : page;
      }),
    };
  }
}
