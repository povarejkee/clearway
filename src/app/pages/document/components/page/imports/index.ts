import { Type } from '@angular/core';
import { ContextMenuDirective } from '../../../../../core/directives/context-menu/context-menu.directive';
import { AnnotationComponent } from '../../annotation/annotation.component';
import { AnnotationDraftComponent } from '../../annotation-draft/annotation-draft.component';

export const PageImports: Type<unknown>[] = [
  ContextMenuDirective,
  AnnotationComponent,
  AnnotationDraftComponent,
];
