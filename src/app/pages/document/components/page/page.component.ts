import {
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { IDocumentPage } from '../../interfaces/document.interface';
import { IAnnotation } from '../../interfaces/annotation.interface';
import { ContextMenuDirective } from '../../../../core/directives/context-menu/context-menu.directive';
import { IContextMenuEvent } from '../../../../core/interfaces/context-menu-event.interface';
import { AnnotationComponent } from '../annotation/annotation.component';
import { AnnotationDraftComponent } from '../annotation-draft/annotation-draft.component';
import { IContextMenuItem } from '../../../../core/interfaces/context-menu-item.interface';
import { CONTEXT_MENU_ITEMS } from '../../db';
import { TCoordinate } from '../../types';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  imports: [ContextMenuDirective, AnnotationComponent, AnnotationDraftComponent],
})
export class PageComponent {
  public page: InputSignal<IDocumentPage> = input.required<IDocumentPage>();
  public annotationAdd: OutputEmitterRef<IAnnotation> = output<IAnnotation>();
  public annotationDelete: OutputEmitterRef<string> = output<string>();
  public annotationMove: OutputEmitterRef<{ id: string; x: number; y: number }> = output<{
    id: string;
    x: number;
    y: number;
  }>();

  protected draft: WritableSignal<TCoordinate> = signal(null);

  protected readonly contextMenuItems: IContextMenuItem[] = CONTEXT_MENU_ITEMS;

  protected onMenuItemSelect(event: IContextMenuEvent): void {
    this.draft.set({ x: event.x, y: event.y });
  }

  protected onDraftCommit(content: string): void {
    this.annotationAdd.emit({
      id: crypto.randomUUID(),
      x: this.draft().x,
      y: this.draft().y,
      content,
    });

    this.draft.set(null);
  }
}
