export interface Sprite {
  id: string;
  name: string;
  imageUrl: string;
  layer: 'base' | 'secondary';
  sheetId?: string;
  gridRow?: number;
  gridCol?: number;
  totalRows?: number;
  totalCols?: number;
}

export interface PlacedSprite {
  spriteId: string;
  sprite: Sprite;
  row: number;
  col: number;
}
