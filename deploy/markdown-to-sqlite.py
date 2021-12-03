import argparse
import markdown_katex
import markdown
import sqlite3
import htmlmin
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("files", type=Path, nargs="+")
    return parser.parse_args()

def update_tags(db_con, tag_list):
    assert all(isinstance(t, str) for t in tag_list)
    cursor = db_con.executemany('INSERT OR IGNORE INTO tags(tag_name) VALUES (?)', ((t,) for t in tag_list))
    id_list = cursor.execute(f'SELECT id FROM tags WHERE tag_name IN ({", ".join("?" for _ in tag_list)})', tag_list)
    return list(t[0] for t in id_list)


def ensure_database():
    with sqlite3.connect("/blog/db.sqlite3") as db_con:
        with open("/blog/schema.sql") as schema:
            db_con.executescript(schema.read())
            # TODO: migrations
    # here the changes are commited
    return db_con


def insert_post(db_con, html, title, subtitle, date):
    cursor = db_con.execute('INSERT INTO posts (content, title, subtitle, date) VALUES (?, ?, ?, ?)', (html, title, subtitle, date))
    return cursor.lastrowid

def tag_post(db_con, post_id, tag_ids):
    db_con.executemany('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', ((post_id, tag_id) for tag_id in tag_ids))
    return

def write_markdown_to_db(file: Path, db_con):
    content = file.read_text()
    md = markdown.Markdown(
        extensions=[
            "pymdownx.extra",
            "markdown_katex",
            "full_yaml_metadata",
            "mdx_urlize",
            "smarty",
            "sane_lists",
            "footnotes",
            "mdx_breakless_lists",
            "pymdownx.emoji",
            "toc",
            "codehilite",
        ],
        extension_configs=dict(
            codehilite={"css_class": "codehilite", "lineno": True},
            toc={"marker": "!!!TOC!!!"},
        ),
        output_format="html5",
    )
    html = md.convert(content)
    # html = htmlmin.minify(html)
    html = '<link rel="stylesheet" href="codehilite.css"/>\n' + html
    metadata = md.Meta
    tag_id_list = update_tags(db_con, metadata['tags'])
    post_id = insert_post(db_con, html, metadata.get('title'), metadata.get('subtitle'), metadata.get('date'))
    tag_post(db_con, post_id, tag_id_list)
    return


def main(file_list):
    db_con = ensure_database()
    with db_con:
        for file in file_list:
            write_markdown_to_db(file, db_con)
    db_con.close()
    return


if __name__ == "__main__":
    args = parse_args()
    main(args.files)
