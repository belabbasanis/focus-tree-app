import { useState, useRef, useEffect } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Calculate offset to make all tile x coordinates positive
  // This is calculated before rendering tiles
  const leftmostXForOffset = -(rows - 1) * (tileWidth / 2);
  const xOffset = -leftmostXForOffset;

  // Render tiles
  const tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const { x, y } = cartesianToIsometric(row, col);
      // Offset x coordinate so all tiles are within container bounds
      tiles.push(
        <IsometricTile
          key={`tile-${row}-${col}`}
          x={x + xOffset}
          y={y}
          row={row}
          col={col}
          width={tileWidth}
          height={tileHeight}
          isSelected={isSelected(row, col)}
          onClick={handleTileClick}
        />
      );
    }
  }

  // Render objects separately - anchor to tile's bottom-center point
  const objects = placedSprites.map((placed) => {
    const { x, y } = cartesianToIsometric(placed.row, placed.col);
    // Object z-index must be higher than tiles to appear above them
    const objectZIndex = placed.row + placed.col + 1000; // Safe offset above tiles
    
    return (
      <img
        key={`object-${placed.row}-${placed.col}-${placed.spriteId}`}
        src={placed.sprite.imageUrl}
        alt={placed.sprite.name}
        className="absolute drop-shadow-lg"
        style={{
          left: `${x + xOffset + tileWidth / 2}px`, // Tile center X (with offset)
          top: `${y + tileHeight}px`,  // Tile center Y (bottom-center anchor point)
          transform: 'translate(-50%, -100%)', // Anchor bottom-center of sprite to tile center
          width: `${tileWidth * 1.2}px`, // Fixed width slightly larger than tile for better visibility
          height: 'auto', // Let height scale to maintain aspect ratio
          maxHeight: `${tileHeight * 2}px`, // Prevent sprites from being too tall
          pointerEvents: 'none', // Don't capture clicks - let tiles handle them
          zIndex: objectZIndex,
          objectFit: 'contain',
        }}
      />
    );
  });

  // Calculate actual bounds of isometric grid
  // Leftmost tile: row = rows-1, col = 0 → x = -(rows-1) * (tileWidth/2)
  // Rightmost tile: row = 0, col = cols-1 → x = (cols-1) * (tileWidth/2)
  // Account for tile width: right edge = (cols-1) * (tileWidth/2) + tileWidth
  const leftmostX = -(rows - 1) * (tileWidth / 2);
  const rightmostX = (cols - 1) * (tileWidth / 2) + tileWidth;
  const gridWidth = rightmostX - leftmostX;
  const containerHeight = (rows + cols) * (tileHeight / 2);

  // Create a scrollable wrapper that's wider than viewport
  // The wrapper needs to be wide enough to allow scrolling in both directions
  const scrollWrapperWidth = Math.max(2000, gridWidth + 1000);
  
  // Add horizontal padding to create scrollable space on both sides for mobile
  // Large padding ensures grid can scroll left and right from centered position
  const horizontalPadding = 1000;
  
  // Position the grid container so its center aligns with the scroll wrapper center
  // Since tiles are offset so leftmost is at 0, the grid center in container coordinates is at gridWidth/2
  // To center it in the scroll wrapper: container left = scrollWrapperWidth/2 - gridWidth/2
  const gridContainerLeft = scrollWrapperWidth / 2 - gridWidth / 2;

  // Scroll to center on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Wait for layout to complete - use multiple RAF calls + delay for mobile
      // Mobile browsers may need more time to calculate layout
      const scrollToCenter = () => {
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        
        // Center the grid horizontally
        if (scrollWidth > clientWidth) {
          container.scrollLeft = (scrollWidth - clientWidth) / 2;
        }
        // Center the grid vertically
        if (scrollHeight > clientHeight) {
          container.scrollTop = (scrollHeight - clientHeight) / 2;
        }
      };
      
      // Multiple RAF calls + setTimeout delay for mobile layout completion
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollToCenter();
          }, 150); // Delay for mobile browsers to complete layout
        });
      });
    }
  }, [rows, cols]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-full"
      style={{
        overflow: 'scroll', // Critical: use 'scroll' not 'auto' for Android WebView
      }}
    >
      <div
        style={{
          paddingTop: '10vh',
          paddingBottom: '10vh',
          paddingLeft: `${horizontalPadding}px`, // Add left padding for scrollable space
          paddingRight: `${horizontalPadding}px`, // Add right padding for scrollable space
          width: `${scrollWrapperWidth}px`,
          minWidth: `${scrollWrapperWidth}px`, // Ensure minimum width for scrolling on mobile
          height: `${containerHeight + 2000}px`, // Natural height that exceeds viewport - critical for Android WebView
          position: 'relative',
          display: 'block', // Explicit block display - critical for Android WebView
        }}
      >
        <div
          className="relative"
          style={{
            width: `${gridWidth}px`,
            height: `${containerHeight}px`,
            position: 'absolute',
            left: `${gridContainerLeft}px`,
            top: '10vh', // Explicit top positioning
          }}
        >
          {/* Render tiles first */}
          {tiles}
          {/* Render objects on top */}
          {objects}
        </div>
      </div>
      {/*{selectedTile && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 text-center text-white font-retro text-xs bg-black border-2 border-white px-4 py-2 uppercase" style={{ imageRendering: 'pixelated' }}>
          ROW {selectedTile.row}, COL {selectedTile.col}
        </div>
      )}*/}
    </div>
  );
};

export default IsometricGrid;
