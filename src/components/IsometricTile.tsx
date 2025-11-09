import { Sprite } from '../types/sprite';

interface IsometricTileProps {
  x: number;
  y: number;
  row: number;
  col: number;
  width: number;
  height: number;
  isSelected: boolean;
  onClick: (row: number, col: number) => void;
  sprite?: Sprite;
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
  sprite,
}: IsometricTileProps) => {
  const handleClick = () => {
    onClick(row, col);
  };

  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        left: '50%',
        top: '20%',
        transform: `translate(${x}px, ${y}px)`,
      }}
      onClick={handleClick}
    >
      <div
        className={`relative transition-all duration-200 ${
          isSelected ? 'scale-105' : 'hover:scale-102'
        }`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="drop-shadow-md"
        >
          <polygon
            points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`}
            fill={isSelected ? '#3b82f6' : '#64748b'}
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="1.5"
            className="transition-all duration-200"
            opacity="0.3"
          />
          <polygon
            points={`${width / 2},0 ${width},${height / 2} ${width / 2},${height / 2}`}
            fill={isSelected ? '#2563eb' : '#475569'}
            opacity="0"
          />
          <polygon
            points={`0,${height / 2} ${width / 2},${height} ${width / 2},${height / 2}`}
            fill={isSelected ? '#1e40af' : '#334155'}
            opacity="0"
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white opacity-50"
          style={{ pointerEvents: 'none' }}
        >
          {row},{col}
        </div>
        {sprite && (
          <img
            src={sprite.imageUrl}
            alt={sprite.name}
            className="absolute drop-shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${width * 1.2}px`,
              height: 'auto',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default IsometricTile;
