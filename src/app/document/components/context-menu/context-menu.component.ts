import { Component, input, output } from '@angular/core';
import { AnnotationType } from '../../types';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
  host: {
    '[style.left.px]': 'x()',
    '[style.top.px]': 'y()',
  },
})
export class ContextMenuComponent {
  public x = input.required<number>();
  public y = input.required<number>();
  public typeSelect = output<AnnotationType>();

  protected onSelect(type: AnnotationType, event: MouseEvent): void {
    event.stopPropagation();

    this.typeSelect.emit(type);
  }
}
