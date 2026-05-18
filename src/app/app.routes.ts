import { Routes } from '@angular/router';
import { DocumentComponent } from './document/document.component';

export const routes: Routes = [
  { path: 'document/:id', component: DocumentComponent },
  { path: '', redirectTo: 'document/1', pathMatch: 'full' },
];
