import { TILE, ICON, EFFECT } from '../lib/ui';

interface IsometricTileProps {
  x: number;
  y: number;
  row: number;
  col: number;
  width: number;
  height: number;
  isSelected: boolean;
  onClick: (row: number, col: number) => void;
}

const IsometricTile = ({
  x,
  y,
  row,
  col,
  width,
  height,
  isSelected,
  onClick,
}: IsometricTileProps) => {
  const handleClick = () => {
    onClick(row, col);
  };

  // Calculate z-index based on position (tiles closer to viewer have higher z-index)
  const zIndex = row + col;

  return (
    <div
      className={TILE.base}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: zIndex,
        transformOrigin: 'center center',
        touchAction: 'manipulation', // Allow scrolling gestures while preserving tap
      }}
      onClick={handleClick}
    >
      <div
        className={`${TILE.inner} ${isSelected ? TILE.selected : ''}`}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: 'block', ...ICON.pixel }}
        >
          <polygon
            points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
            fill={isSelected ? '#ffffff' : '#000000'}
            stroke="#ffffff"
            strokeWidth="2"
            className="transition-none"
            opacity={isSelected ? '0.5' : '0.2'}
          />
        </svg>
        <div
          className={`${TILE.label} ${EFFECT.noPointerEvents}`}
          style={ICON.pixel}
        >
          {row},{col}
        </div>
      </div>
    </div>
  );
};

export default IsometricTile;
