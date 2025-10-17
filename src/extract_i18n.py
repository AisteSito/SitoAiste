import os
import re
from bs4 import BeautifulSoup
import json

# Твои языки
LANGUAGES = ["lt", "en", "ru", "de", "lv", "pl", "fi", "it", "sl", "no"]

# Папки, где искать HTML (можно добавить)
HTML_DIRS = ["."]

# Файл, в который сохранится JSON
OUTPUT_FILE = "i18n_keys.json"

def extract_i18n_keys():
    # Используем словарь для хранения ключей и их текста на литовском
    keys_dict = {}

    for directory in HTML_DIRS:
        for root, dirs, files in os.walk(directory):
            for file in files:
                # Ищем .njk, .html, .htm
                if file.endswith(".njk") or file.endswith(".html") or file.endswith(".htm"):
                    filepath = os.path.join(root, file)
                    print(f"Обрабатываю: {filepath}")
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            content = f.read()

                        soup = BeautifulSoup(content, 'html.parser')

                        # Ищем все элементы с data-i18n
                        elements = soup.find_all(attrs={"data-i18n": True})

                        for el in elements:
                            key = el.get("data-i18n")
                            if key:
                                # Извлекаем текст из элемента (если он есть и не является дочерним data-i18n)
                                # Ищем только непосредственный текст, игнорируя вложенные элементы с data-i18n
                                direct_children_with_i18n = el.find_all(attrs={"data-i18n": True})
                                all_strings = el.find_all(string=True, recursive=False)
                                text_content = ''.join(all_strings).strip()

                                # Если есть вложенные элементы с data-i18n, игнорируем прямой текст
                                if direct_children_with_i18n:
                                    text_content = key # Если вложенные элементы, используем ключ как резерв

                                if key not in keys_dict:
                                    # Сохраняем текст как значение по умолчанию для литовского
                                    keys_dict[key] = text_content if text_content else key
                                # Если lt пустой и нашли текст, заполняем
                                elif not keys_dict[key] and text_content:
                                    keys_dict[key] = text_content

                    except Exception as e:
                        print(f"Ошибка при обработке {filepath}: {e}")

    return keys_dict

def create_i18n_json(keys_dict):
    result = {}
    for lang in LANGUAGES:
        result[lang] = {}
        for key, lt_text in keys_dict.items():
            # Заполняем литовский языком оригинальный текст, остальные - пустыми строками
            result[lang][key] = lt_text if lang == "lt" else ""
    return result

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"JSON сохранён в: {filename}")

if __name__ == "__main__":
    print("Запускаю скрипт извлечения i18n ключей...")
    keys_dict = extract_i18n_keys()
    if keys_dict:
        print(f"Найдено {len(keys_dict)} уникальных ключей.")
        i18n_json = create_i18n_json(keys_dict)
        save_to_json(i18n_json, OUTPUT_FILE)
        print("Готово! Проверь файл:", OUTPUT_FILE)
    else:
        print("Не найдено элементов с data-i18n.")