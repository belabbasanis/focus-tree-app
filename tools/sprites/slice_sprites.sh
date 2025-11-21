#!/bin/bash
# Slice sprite sheets into individual tiles using ImageMagick

OUTPUT_DIR="public/sprites/tiles"
mkdir -p "$OUTPUT_DIR"

# Function to slice a sprite sheet
slice_sheet() {
    local input_file="$1"
    local prefix="$2"
    local name="$3"

    echo "Processing $name..."

    # Get image dimensions
    dimensions=$(identify -format "%wx%h" "$input_file")
    width=$(echo $dimensions | cut -d'x' -f1)
    height=$(echo $dimensions | cut -d'x' -f2)

    # Calculate tile dimensions (3x3 grid)
    tile_width=$((width / 3))
    tile_height=$((height / 3))

    # Slice into 3x3 grid
    convert "$input_file" -crop ${tile_width}x${tile_height} +repage +adjoin "${OUTPUT_DIR}/${prefix}_%02d.png"

    echo "✓ Sliced $name into 9 tiles"
}

# Slice each sprite sheet
slice_sheet "public/sprites/ChatGPT Image Nov 7, 2025, 04_22_29 PM.png" "buildings" "Buildings & Structures"
slice_sheet "public/sprites/ChatGPT Image Nov 7, 2025, 05_06_42 PM.png" "infrastructure" "Infrastructure"
slice_sheet "public/sprites/ChatGPT Image Nov 7, 2025, 05_07_16 PM.png" "nature" "Nature"
slice_sheet "public/sprites/ChatGPT Image Nov 7, 2025, 05_07_20 PM.png" "terrain" "Terrain"

echo ""
echo "All sprite sheets sliced successfully!"
echo "Output directory: $OUTPUT_DIR"
echo "Total tiles: $(ls -1 $OUTPUT_DIR/*.png | wc -l)"
