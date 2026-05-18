import { Component, ElementRef, inject, input, InputSignal, signal } from '@angular/core';
import { IAnnotation, IDocumentPage } from '../../interfaces';
import { FacadeService } from '../../services/facade.service';
import { AnnotationComponent } from '../annotation/annotation.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { AnnotationType } from '../../types';

interface ContextMenuPosition {
  x: number;
  y: number;
  annotationX: number;
  annotationY: number;
}

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  imports: [AnnotationComponent, ContextMenuComponent],
})
export class PageComponent {
  public page: InputSignal<IDocumentPage> = input.required<IDocumentPage>();

  private el = inject(ElementRef);
  private facade = inject(FacadeService);

  protected contextMenuPos = signal<ContextMenuPosition | null>(null);

  protected get annotations(): IAnnotation[] {
    return this.page().annotations;
  }

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    const rect: DOMRect = this.el.nativeElement.getBoundingClientRect();
    const annotMinWidth = 120;
    const annotMinHeight = 40;
    const rawX = ((event.clientX - rect.left) / rect.width) * 100;
    const rawY = ((event.clientY - rect.top) / rect.height) * 100;
    this.contextMenuPos.set({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      annotationX: Math.min(rawX, ((rect.width - annotMinWidth) / rect.width) * 100),
      annotationY: Math.min(rawY, ((rect.height - annotMinHeight) / rect.height) * 100),
    });
  }

  protected closeContextMenu(): void {
    this.contextMenuPos.set(null);
  }

  protected onAnnotationCreate(type: AnnotationType): void {
    const pos = this.contextMenuPos();
    if (!pos) return;
    this.facade.addAnnotation(this.page().number, type, pos.annotationX, pos.annotationY);
    this.contextMenuPos.set(null);
  }

  protected onAnnotationDelete(id: string): void {
    this.facade.deleteAnnotation(this.page().number, id);
  }

  protected onAnnotationMove(event: { id: string; x: number; y: number }): void {
    this.facade.moveAnnotation(this.page().number, event.id, event.x, event.y);
  }

  protected onAnnotationContentChange(event: { id: string; content: string }): void {
    this.facade.updateAnnotationContent(this.page().number, event.id, event.content);
  }
}
