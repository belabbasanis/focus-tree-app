import { useState } from 'react';
import IsometricTile from './IsometricTile';
import { PlacedSprite, Sprite } from '../types/sprite';

interface IsometricGridProps {
  rows: number;
  cols: number;
  selectedSprite: Sprite | null;
  placedSprites: PlacedSprite[];
  onPlaceSprite: (row: number, col: number) => void;
}

interface Position {
  row: number;
  col: number;
}

const IsometricGrid = ({
  rows,
  cols,
  selectedSprite,
  placedSprites,
  onPlaceSprite,
}: IsometricGridProps) => {
  const [selectedTile, setSelectedTile] = useState<Position | null>(null);

  const tileWidth = 100;
  const tileHeight = 50;

  const cartesianToIsometric = (row: number, col: number) => {
    const x = (col - row) * (tileWidth / 2);
    const y = (col + row) * (tileHeight / 2);
    return { x, y };
  };

  const handleTileClick = (row: number, col: number) => {
    setSelectedTile({ row, col });
    if (selectedSprite) {
      onPlaceSprite(row, col);
    }
  };

  const isSelected = (row: number, col: number) => {
    return selectedTile?.row === row && selectedTile?.col === col;
  };

  const getSpriteAtPosition = (row: number, col: number) => {
    const placed = placedSprites.find(
      (s) => s.row === row && s.col === col
    );
    return placed?.sprite;
  };

  const tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const { x, y } = cartesianToIsometric(row, col);
      tiles.push(
        <IsometricTile
          key={`${row}-${col}`}
          x={x}
          y={y}
          row={row}
          col={col}
          width={tileWidth}
          height={tileHeight}
          isSelected={isSelected(row, col)}
          onClick={handleTileClick}
          sprite={getSpriteAtPosition(row, col)}
        />
      );
    }
  }

  const containerWidth = (rows + cols) * (tileWidth / 2);
  const containerHeight = (rows + cols) * (tileHeight / 2);

  return (
    <div
      className="relative w-full h-full overflow-auto scrollbar-hide"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        className="relative min-h-full flex items-center justify-center"
        style={{
          padding: '10vh 0',
        }}
      >
        <div
          className="relative"
          style={{
            width: `${containerWidth}px`,
            height: `${containerHeight}px`,
          }}
        >
          {tiles}
        </div>
      </div>
      {selectedTile && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 text-center text-gray-600 font-mono text-sm bg-white/80 px-4 py-2 rounded-lg">
          Selected: Row {selectedTile.row}, Col {selectedTile.col}
        </div>
      )}
    </div>
  );
};

export default IsometricGrid;
