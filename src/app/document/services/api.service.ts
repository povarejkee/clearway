import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDocument } from '../interfaces';
import { delay, Observable } from 'rxjs';

const DELAY: number = 1000;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http: HttpClient = inject(HttpClient);

  public getDocument(id: string): Observable<IDocument> {
    return this.http.get<IDocument>(`/documents/${id}.json`).pipe(delay(DELAY));
  }
}
