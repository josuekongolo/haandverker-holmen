#!/bin/bash

# Freepik API Image Fetcher for Håndverker Holmen AS
API_KEY="FPSX16ea10a2ecf0f342b45d9a1ad35dde33"
BASE_DIR="/Users/josuekongolo/Downloads/nettsider/bygg/Gruppe3/haandverker-holmen/images"

# Function to search and download image
fetch_image() {
    local search_term="$1"
    local output_path="$2"
    local output_name="$3"

    echo "Searching for: $search_term"

    # URL encode the search term
    encoded_term=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$search_term'))")

    # Search for images
    search_result=$(curl -s -X GET "https://api.freepik.com/v1/resources?locale=en-US&page=1&limit=5&order=relevance&term=${encoded_term}" \
        -H "x-freepik-api-key: $API_KEY" \
        -H "Accept: application/json")

    # Extract first image ID using python
    image_id=$(echo "$search_result" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['data'][0]['id'] if data.get('data') else '')" 2>/dev/null)

    if [ -z "$image_id" ]; then
        echo "  No images found for: $search_term"
        return 1
    fi

    echo "  Found image ID: $image_id"

    # Get download URL
    download_result=$(curl -s -X GET "https://api.freepik.com/v1/resources/${image_id}/download" \
        -H "x-freepik-api-key: $API_KEY" \
        -H "Accept: application/json")

    # Extract download URL
    download_url=$(echo "$download_result" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('data', {}).get('url', ''))" 2>/dev/null)

    if [ -z "$download_url" ]; then
        echo "  Could not get download URL"
        return 1
    fi

    echo "  Downloading to: ${output_path}/${output_name}"
    mkdir -p "$output_path"
    curl -s -L "$download_url" -o "${output_path}/${output_name}"

    if [ -f "${output_path}/${output_name}" ] && [ -s "${output_path}/${output_name}" ]; then
        echo "  Downloaded successfully!"
        return 0
    else
        echo "  Download failed"
        return 1
    fi
}

echo "=============================================="
echo "Fetching images for Håndverker Holmen AS"
echo "=============================================="
echo ""

# === HERO IMAGE ===
echo "=== HERO IMAGE ==="
echo "[1/20] Hero Background - Carpentry"
fetch_image "carpenter woodworking workshop professional" "$BASE_DIR/hero" "hero-bg.jpg"
echo ""

# === SERVICE IMAGES (8) ===
echo "=== SERVICE IMAGES ==="
echo "[2/20] Tilbygg (Extensions)"
fetch_image "house extension building construction wood" "$BASE_DIR/services" "tilbygg.jpg"
echo ""

echo "[3/20] Garasje (Garage)"
fetch_image "wooden garage construction building" "$BASE_DIR/services" "garasje.jpg"
echo ""

echo "[4/20] Rehabilitering (Renovation)"
fetch_image "house renovation interior construction" "$BASE_DIR/services" "rehabilitering.jpg"
echo ""

echo "[5/20] Terrasse (Terrace)"
fetch_image "wooden terrace deck outdoor construction" "$BASE_DIR/services" "terrasse.jpg"
echo ""

echo "[6/20] Vinduer (Windows)"
fetch_image "window installation carpenter" "$BASE_DIR/services" "vinduer.jpg"
echo ""

echo "[7/20] Kjøkken (Kitchen)"
fetch_image "kitchen renovation modern interior design" "$BASE_DIR/services" "kjoekken.jpg"
echo ""

echo "[8/20] Bad (Bathroom)"
fetch_image "bathroom renovation modern tiles" "$BASE_DIR/services" "bad.jpg"
echo ""

echo "[9/20] Landbruk (Farm Buildings)"
fetch_image "farm building barn construction wooden" "$BASE_DIR/services" "landbruk.jpg"
echo ""

# === PROJECT IMAGES (6) ===
echo "=== PROJECT IMAGES ==="
echo "[10/20] Tilbygg Mysen"
fetch_image "house extension finished modern" "$BASE_DIR/projects" "tilbygg-mysen.jpg"
echo ""

echo "[11/20] Garasje Askim"
fetch_image "modern garage building completed" "$BASE_DIR/projects" "garasje-askim.jpg"
echo ""

echo "[12/20] Terrasse Spydeberg"
fetch_image "modern wooden terrace glass railing" "$BASE_DIR/projects" "terrasse-spydeberg.jpg"
echo ""

echo "[13/20] Renovering Trøgstad"
fetch_image "interior renovation living room modern" "$BASE_DIR/projects" "renovering-troegstad.jpg"
echo ""

echo "[14/20] Tilbygg Hærland (Home Office)"
fetch_image "home office extension small building" "$BASE_DIR/projects" "tilbygg-haerland.jpg"
echo ""

echo "[15/20] Vinduer Rakkestad"
fetch_image "new windows house installation" "$BASE_DIR/projects" "vinduer-rakkestad.jpg"
echo ""

# === ABOUT IMAGES (2) ===
echo "=== ABOUT IMAGES ==="
echo "[16/20] Ansten Intro"
fetch_image "professional carpenter portrait craftsman" "$BASE_DIR/about" "ansten-intro.jpg"
echo ""

echo "[17/20] Ansten Portrait"
fetch_image "carpenter worker professional portrait" "$BASE_DIR/about" "ansten-portrait.jpg"
echo ""

# === EXTRA PROJECT IMAGES FOR INDEX (4) ===
echo "=== INDEX PROJECT CARDS ==="
echo "[18/20] Project Card - Tilbygg"
fetch_image "small house extension wood frame" "$BASE_DIR/projects" "card-tilbygg.jpg"
echo ""

echo "[19/20] Project Card - Garasje"
fetch_image "detached garage wooden" "$BASE_DIR/projects" "card-garasje.jpg"
echo ""

echo "[20/20] Project Card - Terrasse"
fetch_image "outdoor wooden deck patio" "$BASE_DIR/projects" "card-terrasse.jpg"
echo ""

echo "=============================================="
echo "Image fetching complete!"
echo "=============================================="

# List downloaded images
echo ""
echo "Downloaded images:"
find "$BASE_DIR" -name "*.jpg" -type f 2>/dev/null | while read f; do
    size=$(ls -lh "$f" | awk '{print $5}')
    echo "  $f ($size)"
done
