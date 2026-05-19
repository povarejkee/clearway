import { Component, input, InputSignal } from '@angular/core';
import { IDocumentPage } from '../../interfaces/document.interface';
import { TAnnotation } from '../../types';
import { ContextMenuDirective } from '../../../../core/directives/context-menu/context-menu.directive';
import { IContextMenuItem } from '../../../../core/interfaces/context-menu-item.interface';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  imports: [ContextMenuDirective],
})
export class PageComponent {
  public page: InputSignal<IDocumentPage> = input.required<IDocumentPage>();

  protected readonly contextMenuItems: IContextMenuItem<TAnnotation>[] = [
    { label: 'Текстовая аннотация', value: 'text' },
    { label: 'Аннотация с изображением', value: 'image' },
  ];

  protected onMenuItemSelect(item: IContextMenuItem): void {
    console.log('Selected annotation type:', item.value);
  }
}
