import { Component, input, InputSignal } from '@angular/core';
import { IDocumentPage } from '../../interfaces/document.interface';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
})
export class PageComponent {
  public page: InputSignal<IDocumentPage> = input.required<IDocumentPage>();
}
