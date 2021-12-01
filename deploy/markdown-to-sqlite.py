import argparse
import markdown_katex
import markdown
import sqlite3
import htmlmin
from pathlib import Path

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('files', type=Path, nargs='+')
    return parser.parse_args()

def ensure_database():
    with sqlite3.connect('/blog/db.sqlite3') as db_con:
        with open('/blog/schema.sql') as schema:
            db_con.executescript(schema.read())
    # here the changes are commited
    return db_con


def write_markdown_to_db(file: Path, db_con):
    content = file.read_text()
    md = markdown.Markdown(extensions=['pymdownx.extra', 'markdown_katex', 'full_yaml_metadata', 'mdx_urlize', 'smarty', 'sane_lists', 'footnotes', 'mdx_breakless_lists', 'pymdownx.emoji'])
    html = md.convert(content)
    #html = htmlmin.minify(html)
    print(html)
    print(md.Meta)
    return


def main(file_list):
    db_con = ensure_database()
    for file in file_list:
        write_markdown_to_db(file, db_con)
    db_con.close()
    return

if __name__ == "__main__":
    args = parse_args()
    main(args.files)
