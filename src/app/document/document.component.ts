import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacadeService } from './services/facade.service';
import { DocumentImports, DocumentProviders } from './imports';

const PAGE_BASE_WIDTH: number = 860;

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  imports: DocumentImports,
  providers: DocumentProviders,
  styleUrl: './document.component.scss',
})
export class DocumentComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  protected facade: FacadeService = inject(FacadeService);

  protected pageWidth: Signal<number> = computed((): number => {
    return Math.round((PAGE_BASE_WIDTH * this.facade.zoom()) / 100);
  });

  ngOnInit(): void {
    this.getDocument();
  }

  private getDocument(): void {
    const id: string = this.route.snapshot.paramMap.get('id')!;

    this.facade.getDocument(id);
  }
}
