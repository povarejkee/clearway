import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacadeService } from './services/facade.service';
import { DocumentImports, DocumentProviders } from './imports';

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

  ngOnInit(): void {
    this.getDocument();
  }

  private getDocument(): void {
    const id: string = this.route.snapshot.paramMap.get('id')!;

    this.facade.getDocument(id);
  }
}
