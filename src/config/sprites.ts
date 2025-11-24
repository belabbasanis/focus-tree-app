import { Sprite } from '../types/sprite';

// Base layer sprites (ground/terrain)
const BASE_LAYER_IDS = [
  'tile_01',
];

// Helper function to format sprite name
const formatSpriteName = (id: string): string => {
  return id
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\d+$/, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
};

// Generate base layer sprites
const baseLayerSprites: Sprite[] = BASE_LAYER_IDS.map(id => ({
  id,
  name: formatSpriteName(id),
  imageUrl: `/sprites/${id}.png`,
  layer: 'base' as const,
}));

// Secondary layer sprites (objects/decorations)
const SECONDARY_LAYER_IDS = [
  'tile_02', 'tile_03', 'tile_04', 'tile_05', 'tile_06', 'tile_07', 'tile_08', 'tile_09', 'tile_10',
  'tile_11', 'tile_12', 'tile_13', 'tile_14', 'tile_15', 'tile_16', 'tile_17', 'tile_18', 'tile_19', 'tile_20',
  'tile_21', 'tile_22', 'tile_23', 'tile_24', 'tile_25', 'tile_26', 'tile_27', 'tile_28', 'tile_29', 'tile_30', 'tile_grass',
];

const secondaryLayerSprites: Sprite[] = SECONDARY_LAYER_IDS.map(id => ({
  id,
  name: formatSpriteName(id),
  imageUrl: `/sprites/${id}.png`,
  layer: 'secondary' as const,
}));

// Combine all sprites
export const SPRITES: Sprite[] = [...baseLayerSprites, ...secondaryLayerSprites];
