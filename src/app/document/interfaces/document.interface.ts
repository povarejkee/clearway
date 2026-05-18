export interface IDocumentPage {
  number: number;
  imageUrl: string;
}

export interface IDocument {
  name: string;
  pages: IDocumentPage[];
}
