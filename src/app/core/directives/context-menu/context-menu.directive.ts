import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  Directive,
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
import { IContextMenuItem } from '../../interfaces/context-menu-item.interface';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';

@Directive({
  selector: '[appContextMenu]',
  host: {
    '(contextmenu)': 'onContextMenu($event)',
  },
})
export class ContextMenuDirective implements OnDestroy {
  public items: InputSignal<IContextMenuItem[]> = input.required<IContextMenuItem[]>();
  public itemSelect: OutputEmitterRef<IContextMenuItem> = output<IContextMenuItem>();

  private appRef: ApplicationRef = inject(ApplicationRef);
  private injector: EnvironmentInjector = inject(EnvironmentInjector);

  private componentRef: ComponentRef<ContextMenuComponent> | null = null;
  private closeListener: (() => void) | null = null;

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();

    this.destroyMenu();

    const componentRef: ComponentRef<ContextMenuComponent> = createComponent(ContextMenuComponent, {
      environmentInjector: this.injector,
      bindings: [
        inputBinding('x', () => event.clientX),
        inputBinding('y', () => event.clientY),
        inputBinding('items', () => this.items()),
        outputBinding<IContextMenuItem>('itemSelect', (item: IContextMenuItem): void => {
          this.itemSelect.emit(item);
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

  public ngOnDestroy(): void {
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
