import { Injectable, signal, WritableSignal } from '@angular/core';
import { IDocument } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class StateService {
  public document: WritableSignal<IDocument> = signal<IDocument>(null);
  public isLoadingDoc: WritableSignal<boolean> = signal<boolean>(false);
  public zoom: WritableSignal<number> = signal<number>(100);
}
