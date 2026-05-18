import {
  afterNextRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { IAnnotation } from '../../interfaces';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  host: {
    '[style.left]': 'localX() + "%"',
    '[style.top]': 'localY() + "%"',
  },
})
export class AnnotationComponent implements OnDestroy {
  public annotation = input.required<IAnnotation>();
  public deleted = output<string>();
  public moved = output<{ id: string; x: number; y: number }>();
  public contentChanged = output<{ id: string; content: string }>();

  private el = inject(ElementRef);
  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private textEl = viewChild<ElementRef<HTMLDivElement>>('textEl');

  protected localX = signal(0);
  protected localY = signal(0);
  protected hasContent = computed(() => !!this.annotation().content);

  private isDragging = false;
  private startMouseX = 0;
  private startMouseY = 0;
  private startX = 0;
  private startY = 0;
  private parentRect: DOMRect | null = null;
  private maxX = 100;
  private maxY = 100;

  private readonly onMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
  private readonly onMouseUp = () => this.handleMouseUp();

  constructor() {
    effect(() => {
      if (!this.isDragging) {
        this.localX.set(this.annotation().x);
        this.localY.set(this.annotation().y);
      }
    });

    afterNextRender(() => {
      const el = this.textEl()?.nativeElement;

      if (el) el.innerText = this.annotation().content;
    });
  }

  protected onDragStart(event: MouseEvent): void {
    event.preventDefault();

    this.isDragging = true;
    this.startMouseX = event.clientX;
    this.startMouseY = event.clientY;
    this.startX = this.localX();
    this.startY = this.localY();
    this.parentRect = this.el.nativeElement.parentElement.getBoundingClientRect();

    const annotEl = this.el.nativeElement as HTMLElement;

    this.maxX = ((this.parentRect.width - annotEl.offsetWidth) / this.parentRect.width) * 100;
    this.maxY = ((this.parentRect.height - annotEl.offsetHeight) / this.parentRect.height) * 100;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.parentRect) return;

    const dx = ((event.clientX - this.startMouseX) / this.parentRect.width) * 100;
    const dy = ((event.clientY - this.startMouseY) / this.parentRect.height) * 100;

    this.localX.set(Math.max(0, Math.min(this.maxX, this.startX + dx)));
    this.localY.set(Math.max(0, Math.min(this.maxY, this.startY + dy)));
  }

  private handleMouseUp(): void {
    this.isDragging = false;
    this.moved.emit({ id: this.annotation().id, x: this.localX(), y: this.localY() });

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  protected onDelete(event: MouseEvent): void {
    event.stopPropagation();

    this.deleted.emit(this.annotation().id);
  }

  protected onTextInput(event: Event): void {
    const content = (event.target as HTMLDivElement).innerText;

    this.contentChanged.emit({ id: this.annotation().id, content });
  }

  protected onImageClick(): void {
    this.fileInput()?.nativeElement.click();
  }

  protected onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    this.contentChanged.emit({ id: this.annotation().id, content: url });
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}
