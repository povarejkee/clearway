import {
  afterNextRender,
  Component,
  ElementRef,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-annotation-draft',
  templateUrl: './annotation-draft.component.html',
  styleUrl: './annotation-draft.component.scss',
  host: {
    '[style.left.px]': 'x()',
    '[style.top.px]': 'y()',
  },
})
export class AnnotationDraftComponent {
  public x: InputSignal<number> = input.required<number>();
  public y: InputSignal<number> = input.required<number>();

  public commit: OutputEmitterRef<string> = output<string>();
  public discard: OutputEmitterRef<void> = output<void>();

  private textareaRef: Signal<ElementRef<HTMLTextAreaElement>> =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('textareaRef');

  constructor() {
    // tried instead of afterViewInit:
    afterNextRender((): void => {
      this.textareaRef().nativeElement.focus();
    });
  }

  protected onBlur(event: FocusEvent): void {
    const content: string = (event.target as HTMLTextAreaElement).value.trim();

    if (content) {
      this.commit.emit(content);
    } else {
      this.discard.emit();
    }
  }
}
