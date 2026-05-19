import { inject, Injectable, Signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs';
import { ApiService } from './api.service';
import { CoreService } from './core.service';
import { StateService } from './state.service';
import { IAnnotation } from '../interfaces/annotation.interface';
import { IDocument, IDocumentPage } from '../interfaces/document.interface';

@Injectable()
export class FacadeService {
  private api: ApiService = inject(ApiService);
  private core: CoreService = inject(CoreService);
  private state: StateService = inject(StateService);

  public getDocument(id: string): void {
    this.state.isLoadingDoc.set(true);

    this.api
      .getDocument(id)
      .pipe(
        map((doc: IDocument): IDocument => this.core.transformDocument(doc)),
        finalize((): void => this.state.isLoadingDoc.set(false)),
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

  public addAnnotation(pageNumber: number, annotation: IAnnotation): void {
    this.state.document.update((doc: IDocument): IDocument => ({
      ...doc,
      pages: doc.pages.map((page: IDocumentPage): IDocumentPage =>
        page.number === pageNumber
          ? { ...page, annotations: [...page.annotations, annotation] }
          : page,
      ),
    }));
  }

  public deleteAnnotation(pageNumber: number, id: string): void {
    this.state.document.update((doc: IDocument): IDocument => ({
      ...doc,
      pages: doc.pages.map((page: IDocumentPage): IDocumentPage =>
        page.number === pageNumber
          ? { ...page, annotations: page.annotations.filter((a: IAnnotation): boolean => a.id !== id) }
          : page,
      ),
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

  public save(): void {
    console.log(this.state.document());
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
