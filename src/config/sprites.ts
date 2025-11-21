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

// Secondary layer sprites (objects/decorations) - temporarily empty for testing
const secondaryLayerSprites: Sprite[] = [];

// Combine all sprites
export const SPRITES: Sprite[] = [...baseLayerSprites, ...secondaryLayerSprites];
