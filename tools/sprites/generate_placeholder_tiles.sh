#!/bin/bash
# Generate placeholder colored tiles using ImageMagick

OUTPUT_DIR="public/sprites/tiles"
mkdir -p "$OUTPUT_DIR"

# Define colors for different categories
declare -A COLORS=(
    ["buildings"]="#8B4513,#A0522D,#CD853F,#DEB887,#D2691E,#8B7355,#F4A460,#BC8F8F,#C19A6B"
    ["infrastructure"]="#696969,#808080,#A9A9A9,#C0C0C0,#D3D3D3,#778899,#B0C4DE,#708090,#2F4F4F"
    ["nature"]="#228B22,#32CD32,#90EE90,#00FF00,#7CFC00,#ADFF2F,#9ACD32,#6B8E23,#556B2F"
    ["terrain"]="#8B4513,#A0522D,#CD853F,#D2B48C,#F5DEB3,#DEB887,#BC8F8F,#D2691E,#8B7355"
)

# Create tiles for each category
for category in buildings infrastructure nature terrain; do
    echo "Creating $category tiles..."

    # Split colors into array
    IFS=',' read -ra COLOR_ARRAY <<< "${COLORS[$category]}"

    # Create 9 tiles
    for i in {0..8}; do
        color="${COLOR_ARRAY[$i]}"

        # Create a 128x128 colored square with gradient and border
        convert -size 128x128 \
            -define gradient:angle=135 \
            gradient:"${color}"-"#00000040" \
            -stroke "#000000" -strokewidth 2 \
            -draw "rectangle 0,0 127,127" \
            -pointsize 24 -fill white -gravity center \
            -annotate +0+0 "$i" \
            "${OUTPUT_DIR}/${category}_0${i}.png"
    done

    echo "✓ Created 9 ${category} tiles"
done

echo ""
echo "Created $(ls -1 ${OUTPUT_DIR}/*.png 2>/dev/null | wc -l) placeholder tiles"
echo "These are temporary placeholders - replace with real sprite images later"
