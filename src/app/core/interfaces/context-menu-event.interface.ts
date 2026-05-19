import { IContextMenuItem } from './context-menu-item.interface';

export interface IContextMenuEvent {
  item: IContextMenuItem;
  x: number;
  y: number;
}
