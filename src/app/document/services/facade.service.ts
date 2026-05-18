import { inject, Injectable, Signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs';
import { ApiService } from './api.service';
import { CoreService } from './core.service';
import { StateService } from './state.service';
import { IDocument } from '../interfaces/document.interface';

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

  // <STATE>
  public get document(): Signal<IDocument> {
    return this.state.document;
  }

  public get isLoadingDoc(): Signal<boolean> {
    return this.state.isLoadingDoc;
  }
  // </STATE>
}
