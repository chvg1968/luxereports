#!/usr/bin/env python3

import sys
from bs4 import BeautifulSoup
from titlecase import titlecase
import re

# Lista de nombres de marcas a preservar
BRAND_NAMES = ["iOS", "Safari", "HTML"]

# Lista de preposiciones a mantener en minúsculas
PREPOSITIONS = ["de", "la", "con", "para"]

def sentence_case(text):
    text = text.strip()
    if not text:
        return text
    first_char = text[0].upper()
    rest = text[1:].lower()
    sentence = first_char + rest
    for brand in BRAND_NAMES:
        sentence = re.sub(brand, brand, sentence, flags=re.IGNORECASE)
    return sentence


def title_case(text):
    # Aplica Title Case y luego corrige preposiciones
    tc = titlecase(text)
    pattern = re.compile(r"\b(" + "|".join(PREPOSITIONS) + r")\b", flags=re.IGNORECASE)
    def repl(m):
        # no afectar la primera posición
        return m.group().lower()
    return pattern.sub(repl, tc)


def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    # Formatear h3 titles a Title Case
    for tag in soup.find_all('h3', class_=['titulo-principal', 'subtitulo']):
        tag.string = title_case(tag.get_text().lower())

    # Formatear etiquetas de lista a Sentence case
    for label in soup.select('ul.lista-inspeccion label'):
        label.string = sentence_case(label.get_text())

    with open(path, 'w', encoding='utf-8') as f:
        f.write(str(soup))


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Uso: python3 format_inspection_titles.py path/to/file.html")
        sys.exit(1)
    process_file(sys.argv[1])
