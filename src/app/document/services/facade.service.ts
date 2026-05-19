import { inject, Injectable, Signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs';
import { ApiService } from './api.service';
import { CoreService } from './core.service';
import { StateService } from './state.service';
import { IAnnotation, IDocument, IDocumentPage } from '../interfaces';
import { AnnotationType } from '../types';

@Injectable({ providedIn: 'root' })
export class FacadeService {
  private api: ApiService = inject(ApiService);
  private core: CoreService = inject(CoreService);
  private state: StateService = inject(StateService);

  public getDocument(id: string): void {
    this.state.isLoadingDoc.set(true);

    this.api
      .getDocument(id)
      .pipe(
        map((doc: IDocument): IDocument => this.core.prepareDocument(doc)),
        finalize(() => this.state.isLoadingDoc.set(false)),
      )
      .subscribe({
        next: (doc: IDocument): void => {
          this.state.document.set(doc);
          console.log(doc);
        },
        error: (err: HttpErrorResponse): void => {
          // todo handle errors
        },
      });
  }

  public addAnnotation(pageNumber: number, type: AnnotationType, x: number, y: number): void {
    const annotation: IAnnotation = { id: crypto.randomUUID(), type, x, y, content: '' };

    this.patchPage(pageNumber, (page) => ({
      ...page,
      annotations: [...page.annotations, annotation],
    }));
  }

  public deleteAnnotation(pageNumber: number, id: string): void {
    this.patchPage(pageNumber, (page) => ({
      ...page,
      annotations: page.annotations.filter((a) => a.id !== id),
    }));
  }

  public moveAnnotation(pageNumber: number, id: string, x: number, y: number): void {
    this.patchPage(pageNumber, (page) => ({
      ...page,
      annotations: page.annotations.map((a) => (a.id === id ? { ...a, x, y } : a)),
    }));
  }

  public updateAnnotationContent(pageNumber: number, id: string, content: string): void {
    this.patchPage(pageNumber, (page) => ({
      ...page,
      annotations: page.annotations.map((a) => (a.id === id ? { ...a, content } : a)),
    }));
  }

  private patchPage(pageNumber: number, patch: (page: IDocumentPage) => IDocumentPage): void {
    this.state.document.update((doc) => ({
      ...doc,
      pages: doc.pages.map((p) => (p.number === pageNumber ? patch(p) : p)),
    }));
  }

  public zoomIn(): void {
    this.state.zoom.update((value: number): number => {
      if (value >= 200) return value;

      return value + 10;
    });
  }

  public zoomOut(): void {
    this.state.zoom.update((value: number): number => {
      if (value <= 20) return value;

      return value - 10;
    });
  }

  // <STATE>
  public get document(): Signal<IDocument> {
    return this.state.document;
  }

  public get isLoadingDoc(): Signal<boolean> {
    return this.state.isLoadingDoc;
  }

  public get zoom(): Signal<number> {
    return this.state.zoom;
  }
  // </STATE>
}
