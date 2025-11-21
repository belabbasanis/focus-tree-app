#!/usr/bin/env python3
"""
Slice sprite sheets into individual isometric tiles.
Each sprite sheet contains a 3x3 grid of tiles.
"""

from PIL import Image
import os

def slice_sprite_sheet(image_path, output_dir, prefix, rows=3, cols=3):
    """
    Slice a sprite sheet into individual tiles.

    Args:
        image_path: Path to the sprite sheet image
        output_dir: Directory to save individual tiles
        prefix: Prefix for output filenames (e.g., 'buildings', 'nature')
        rows: Number of rows in the grid
        cols: Number of columns in the grid
    """
    img = Image.open(image_path)
    img_width, img_height = img.size

    tile_width = img_width // cols
    tile_height = img_height // rows

    os.makedirs(output_dir, exist_ok=True)

    tile_index = 0
    for row in range(rows):
        for col in range(cols):
            left = col * tile_width
            top = row * tile_height
            right = left + tile_width
            bottom = top + tile_height

            tile = img.crop((left, top, right, bottom))

            output_filename = f"{prefix}_{tile_index:02d}.png"
            output_path = os.path.join(output_dir, output_filename)
            tile.save(output_path)

            print(f"Saved: {output_filename}")
            tile_index += 1

def main():
    sprite_sheets = [
        {
            'path': 'public/sprites/ChatGPT Image Nov 7, 2025, 04_22_29 PM.png',
            'prefix': 'buildings',
            'name': 'Buildings & Structures'
        },
        {
            'path': 'public/sprites/ChatGPT Image Nov 7, 2025, 05_06_42 PM.png',
            'prefix': 'infrastructure',
            'name': 'Infrastructure'
        },
        {
            'path': 'public/sprites/ChatGPT Image Nov 7, 2025, 05_07_16 PM.png',
            'prefix': 'nature',
            'name': 'Nature'
        },
        {
            'path': 'public/sprites/ChatGPT Image Nov 7, 2025, 05_07_20 PM.png',
            'prefix': 'terrain',
            'name': 'Terrain'
        }
    ]

    output_base_dir = 'public/sprites/tiles'

    for sheet in sprite_sheets:
        print(f"\nProcessing {sheet['name']}...")
        slice_sprite_sheet(
            sheet['path'],
            output_base_dir,
            sheet['prefix']
        )

    print(f"\nAll sprite sheets sliced successfully!")
    print(f"Output directory: {output_base_dir}")

if __name__ == '__main__':
    main()
