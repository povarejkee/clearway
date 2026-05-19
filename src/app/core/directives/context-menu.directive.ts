import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  Directive,
  ElementRef,
  EnvironmentInjector,
  inject,
  input,
  inputBinding,
  InputSignal,
  OnDestroy,
  output,
  outputBinding,
  OutputEmitterRef,
} from '@angular/core';
import { IContextMenuItem } from '../interfaces/context-menu-item.interface';
import { IContextMenuEvent } from '../interfaces/context-menu-event.interface';
import { ContextMenuComponent } from '../components/context-menu/context-menu.component';

const MENU_WIDTH: number = 220;
const MENU_ITEM_HEIGHT: number = 40;

@Directive({
  selector: '[appContextMenu]',
  host: {
    '(contextmenu)': 'onContextMenu($event)',
  },
})
export class ContextMenuDirective implements OnDestroy {
  public items: InputSignal<IContextMenuItem[]> = input.required<IContextMenuItem[]>();
  public itemSelect: OutputEmitterRef<IContextMenuEvent> = output<IContextMenuEvent>();

  private appRef: ApplicationRef = inject(ApplicationRef);
  private injector: EnvironmentInjector = inject(EnvironmentInjector);
  private el: ElementRef = inject(ElementRef);

  private componentRef: ComponentRef<ContextMenuComponent> | null = null;
  private closeListener: (() => void) | null = null;

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();

    this.destroyMenu();

    const rect: DOMRect = this.el.nativeElement.getBoundingClientRect();
    const x: number = event.clientX - rect.left;
    const y: number = event.clientY - rect.top;

    const componentRef: ComponentRef<ContextMenuComponent> = createComponent(ContextMenuComponent, {
      environmentInjector: this.injector,
      bindings: [
        inputBinding('x', () => Math.min(event.clientX, rect.right - MENU_WIDTH)),
        inputBinding('y', () =>
          Math.min(event.clientY, rect.bottom - this.items().length * MENU_ITEM_HEIGHT),
        ),
        inputBinding('items', () => this.items()),
        outputBinding<IContextMenuItem>('itemSelect', (item: IContextMenuItem): void => {
          this.itemSelect.emit({
            item,
            x,
            y,
            containerWidth: rect.width,
            containerHeight: rect.height,
          });
          this.destroyMenu();
        }),
      ],
    });

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);

    this.componentRef = componentRef;

    this.closeListener = (): void => this.destroyMenu();
    document.addEventListener('click', this.closeListener, { once: true });
  }

  ngOnDestroy(): void {
    this.destroyMenu();
  }

  private destroyMenu(): void {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }

    if (this.closeListener) {
      document.removeEventListener('click', this.closeListener);
      this.closeListener = null;
    }
  }
}
