FROM python:latest

WORKDIR /blog
COPY compile.py .
RUN ["python3", "-m", "pip", "install", "-qqq", "markdown", "htmlmin", "pygments", "markdown-katex", "markdown-full-yaml-metadata", "pymdown-extensions", "mdx-breakless-lists", "pygments", "markdown-captions"]
ENTRYPOINT ["python3", "compile.py"]
