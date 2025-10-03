import os
import json
import frontmatter

# Пути
MD_FOLDER = "src/announcements"
JSON_FILE = "src/script/property.json"

def load_json():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_json(data):
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def md_to_dict(md_path):
    post = frontmatter.load(md_path)
    data = {
        "slug": post.get("slug", ""),
        "Name": post.get("Name", ""),
        "M2": post.get("M2", ""),
        "TotalFloors": post.get("TotalFloors", ""),
        "Bedroom": post.get("Bedroom", ""),
        "ZonaM2": post.get("ZonaM2", ""),
        "Bathroom": post.get("Bathroom", ""),
        "Price": post.get("Price", ""),
        "descrizione": post.get("descrizione", ""),
        "text1": post.get("text1", ""),
        "text3": post.get("text3", ""),
        "text4": post.get("text4", ""),
        "textFinal": post.get("textFinal", ""),
        "images": post.get("images", [])
    }
    return data

def update_json():
    records = load_json()
    records_by_slug = {r["slug"]: r for r in records if r.get("slug")}

    for filename in os.listdir(MD_FOLDER):
        if filename.endswith(".md"):
            path = os.path.join(MD_FOLDER, filename)
            record = md_to_dict(path)

            if record["slug"]:
                # Обновляем или добавляем
                records_by_slug[record["slug"]] = record

    # Перезаписываем JSON
    save_json(list(records_by_slug.values()))

if __name__ == "__main__":
    update_json()
    print("✅ property.json обновлен из md файлов")
    