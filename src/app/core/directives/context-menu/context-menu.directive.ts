import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  Directive,
  EnvironmentInjector,
  HostListener,
  inject,
  input,
  InputSignal,
  OnDestroy,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { IContextMenuItem } from '../../interfaces/context-menu-item.interface';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';

@Directive({
  selector: '[appContextMenu]',
})
export class ContextMenuDirective implements OnDestroy {
  public items: InputSignal<IContextMenuItem[]> = input.required<IContextMenuItem[]>();
  public itemSelect: OutputEmitterRef<IContextMenuItem> = output<IContextMenuItem>();

  private appRef: ApplicationRef = inject(ApplicationRef);
  private injector: EnvironmentInjector = inject(EnvironmentInjector);

  private componentRef: ComponentRef<ContextMenuComponent> = null;
  private closeListener: () => void = null;

  @HostListener('contextmenu', ['$event'])
  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();

    this.destroyMenu();

    const componentRef: ComponentRef<ContextMenuComponent> = createComponent(ContextMenuComponent, {
      environmentInjector: this.injector,
    });

    componentRef.setInput('x', event.clientX);
    componentRef.setInput('y', event.clientY);
    componentRef.setInput('items', this.items());

    componentRef.instance.itemSelect.subscribe((item: IContextMenuItem): void => {
      this.itemSelect.emit(item);
      this.destroyMenu();
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
      this.appRef.detachView(this.componentRef.hostView); // cd drop
      this.componentRef.destroy();
      this.componentRef = null;
    }

    // check an edge case like this.router.navigate["bla-bla-route"]
    if (this.closeListener) {
      document.removeEventListener('click', this.closeListener);

      this.closeListener = null;
    }
  }
}
