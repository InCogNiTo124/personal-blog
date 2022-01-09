#!/usr/bin/env python3

import argparse
import markdown_katex
import markdown
import sqlite3
import htmlmin
from pathlib import Path
import xml.etree.ElementTree as ET
from email.utils import formatdate


def CDATA(text):
    return f"<![CDATA[{text}]]>"

def subelement(parent, tag, text):
    e = ET.SubElement(parent, tag)
    e.text = text
    return e

class RssBuilder():
    def __init__(self):
        self.root = ET.Element('rss')
        self.channel = ET.SubElement(self.root, 'channel')
        title = subelement(self.channel, 'title', "blog.msmetko.xyz")
        link = subelement(self.channel, 'link', 'https://blog.msmetko.xyz')
        description = subelement(self.channel, 'description', 'Marijan Smetko writes about programming, Python, math, physics, machine and deep learning, statistics, Linux, music...')
        language = subelement(self.channel, 'language', 'en-us')
        generator = subelement(self.channel, 'generator', 'msmetko')
        docs = subelement(self.channel, 'docs', 'https://www.rssboard.org/rss-specification')
        managing_editor = subelement(self.channel, 'managingEditor', 'msmetko@msmetko.xyz')
        webmaster = subelement(self.channel, 'webmaster', 'msmetko@msmetko.xyz')
        return
    
    def write(self, filename):
        date = formatdate()
        subelement(self.channel, 'pubDate', date)
        subelement(self.channel, 'lastBuildDate', date)

        ET.ElementTree(self.root).write(filename, encoding='UTF-8', xml_declaration=True)
        return

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


def insert_post(db_con, html, title, subtitle, date, show):
    cursor = db_con.execute('INSERT INTO posts (content, title, subtitle, date, show) VALUES (?, ?, ?, ?, ?)', (html, title, subtitle, date, show))
    return cursor.lastrowid

def tag_post(db_con, post_id, tag_ids):
    db_con.executemany('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', ((post_id, tag_id) for tag_id in tag_ids))
    return

def process_markdown(file: Path, db_con, rss_builder):
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
    post_id = insert_post(db_con, html, metadata.get('title'), metadata.get('subtitle'), metadata.get('date'), metadata.get('show', True))
    tag_post(db_con, post_id, tag_id_list)
    return


def main(file_list):
    rss_builder = RssBuilder()
    db_con = ensure_database()
    with db_con:
        for file in file_list:
            process_markdown(file, db_con, rss_builder)
    db_con.close()
    rss_builder.write('feed.rss')
    return


if __name__ == "__main__":
    args = parse_args()
    main(args.files)
