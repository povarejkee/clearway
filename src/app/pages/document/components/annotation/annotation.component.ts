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
    '[style.left.px]': 'annotation().x * zoomFactor()',
    '[style.top.px]': 'annotation().y * zoomFactor()',
    '[style.transform]': 'transform()',
    '[style.cursor]': 'isDragging() ? "grabbing" : "grab"',
    '[style.user-select]': 'isDragging() ? "none" : null',
    '(mousedown)': 'onMouseDown($event)',
  },
})
export class AnnotationComponent implements OnDestroy {
  public annotation: InputSignal<IAnnotation> = input.required<IAnnotation>();
  public zoomFactor: InputSignal<number> = input.required<number>();
  public delete: OutputEmitterRef<void> = output<void>();
  public move: OutputEmitterRef<TCoordinate> = output<TCoordinate>();

  private el: ElementRef = inject(ElementRef);

  protected isDragging: WritableSignal<boolean> = signal(false);

  private dragTransform: WritableSignal<TCoordinate> = signal({ x: 0, y: 0 });
  private startMouse: TCoordinate = { x: 0, y: 0 };
  private within: TCoordinate = { x: 0, y: 0 };

  protected transform: Signal<string> = computed((): string => {
    const zf: number = this.zoomFactor();
    const drag: TCoordinate = this.dragTransform();

    return drag ? `translate(${drag.x}px, ${drag.y}px) scale(${zf})` : `scale(${zf})`;
  });

  ngOnDestroy(): void {
    this.removeListeners();
  }

  protected onMouseDown(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('.annotation-delete')) return;

    event.preventDefault();

    const parent: HTMLElement = this.el.nativeElement.parentElement;
    const self: HTMLElement = this.el.nativeElement;
    const visualRect: DOMRect = self.getBoundingClientRect();

    this.startMouse = { x: event.clientX, y: event.clientY };
    this.within = {
      x: parent.offsetWidth - visualRect.width,
      y: parent.offsetHeight - visualRect.height,
    };

    this.isDragging.set(true);

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent): void => {
    const zf: number = this.zoomFactor();
    const visualX: number = this.annotation().x * zf;
    const visualY: number = this.annotation().y * zf;

    const rawX: number = visualX + event.clientX - this.startMouse.x;
    const rawY: number = visualY + event.clientY - this.startMouse.y;

    this.dragTransform.set({
      x: Math.max(0, Math.min(rawX, this.within.x)) - visualX,
      y: Math.max(0, Math.min(rawY, this.within.y)) - visualY,
    });
  };

  private onMouseUp = (): void => {
    const transformed = this.dragTransform();
    const zf: number = this.zoomFactor();

    const finalVisualX: number = this.annotation().x * zf + (transformed?.x ?? 0);
    const finalVisualY: number = this.annotation().y * zf + (transformed?.y ?? 0);

    this.move.emit({
      x: Math.round(finalVisualX / zf),
      y: Math.round(finalVisualY / zf),
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
