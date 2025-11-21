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
      className="absolute cursor-pointer transition-all duration-200"
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
        className={`relative transition-none ${
          isSelected ? 'scale-105' : ''
        }`}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: 'block', imageRendering: 'pixelated' }}
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
          className="absolute inset-0 flex items-center justify-center text-xs font-retro text-white opacity-30"
          style={{ pointerEvents: 'none', imageRendering: 'pixelated' }}
        >
          {row},{col}
        </div>
      </div>
    </div>
  );
};

export default IsometricTile;
