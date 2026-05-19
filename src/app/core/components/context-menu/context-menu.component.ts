import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { IContextMenuItem } from '../../interfaces/context-menu-item.interface';

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
  public x: InputSignal<number> = input.required<number>();
  public y: InputSignal<number> = input.required<number>();
  public items: InputSignal<IContextMenuItem[]> = input.required<IContextMenuItem[]>();

  public itemSelect: OutputEmitterRef<IContextMenuItem> = output<IContextMenuItem>();

  protected onSelect(item: IContextMenuItem, event: MouseEvent): void {
    event.stopPropagation();

    this.itemSelect.emit(item);
  }
}
