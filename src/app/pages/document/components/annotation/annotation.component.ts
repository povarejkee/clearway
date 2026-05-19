import {
  computed,
  Component,
  ElementRef,
  inject,
  input,
  InputSignal,
  OnDestroy,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { IAnnotation } from '../../interfaces/annotation.interface';
import { TCoordinate } from '../../types';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  host: {
    '[style.left.px]': 'annotation().x',
    '[style.top.px]': 'annotation().y',
    '[style.transform]': 'transform()',
    '[style.cursor]': 'isDragging() ? "grabbing" : "grab"',
    '[style.user-select]': 'isDragging() ? "none" : null',
    '(mousedown)': 'onMouseDown($event)',
  },
})
export class AnnotationComponent implements OnDestroy {
  public annotation: InputSignal<IAnnotation> = input.required<IAnnotation>();
  public delete: OutputEmitterRef<void> = output<void>();
  public move: OutputEmitterRef<TCoordinate> = output<TCoordinate>();

  private el: ElementRef = inject(ElementRef);

  protected isDragging: WritableSignal<boolean> = signal(false);

  private dragTransform: WritableSignal<TCoordinate> = signal({ x: 0, y: 0 });
  private startMouse: TCoordinate = { x: 0, y: 0 };
  private within: TCoordinate = { x: 0, y: 0 };

  protected transform: Signal<string> = computed((): string => {
    const transformed: TCoordinate = this.dragTransform();

    return transformed ? `translate(${transformed.x}px, ${transformed.y}px)` : null;
  });

  ngOnDestroy(): void {
    this.removeListeners();
  }

  protected onMouseDown(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('.annotation-delete')) return;

    event.preventDefault();

    const parent: HTMLElement = this.el.nativeElement.parentElement;
    const self: HTMLElement = this.el.nativeElement;

    this.startMouse = { x: event.clientX, y: event.clientY };
    this.within = {
      x: parent.offsetWidth - self.offsetWidth,
      y: parent.offsetHeight - self.offsetHeight,
    };

    this.isDragging.set(true);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent): void => {
    const rawX: number = this.annotation().x + event.clientX - this.startMouse.x;
    const rawY: number = this.annotation().y + event.clientY - this.startMouse.y;

    this.dragTransform.set({
      x: Math.max(0, Math.min(rawX, this.within.x)) - this.annotation().x,
      y: Math.max(0, Math.min(rawY, this.within.y)) - this.annotation().y,
    });
  };

  private onMouseUp = (): void => {
    const transformed = this.dragTransform();

    this.move.emit({
      x: this.annotation().x + (transformed?.x ?? 0),
      y: this.annotation().y + (transformed?.y ?? 0),
    });

    this.isDragging.set(false);
    this.dragTransform.set(null);

    this.removeListeners();
  };

  private removeListeners(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}
