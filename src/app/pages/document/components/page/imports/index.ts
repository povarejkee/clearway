import { Type } from '@angular/core';
import { AnnotationComponent } from '../../annotation/annotation.component';
import { AnnotationDraftComponent } from '../../annotation-draft/annotation-draft.component';
import { ContextMenuDirective } from '../../../../../core/directives/context-menu.directive';

export const PageImports: Type<unknown>[] = [
  ContextMenuDirective,
  AnnotationComponent,
  AnnotationDraftComponent,
];
