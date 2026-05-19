import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { IAnnotation } from '../../interfaces/annotation.interface';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.scss',
  host: {
    '[style.left.px]': 'annotation().x',
    '[style.top.px]': 'annotation().y',
  },
})
export class AnnotationComponent {
  public annotation: InputSignal<IAnnotation> = input.required<IAnnotation>();
  public delete: OutputEmitterRef<void> = output<void>();
}
