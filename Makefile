sqlite: docker-pull
	docker container run --rm -u $(shell id -u):$(shell id -g) -v $(CURDIR)/posts/:/blog/posts/ ghcr.io/incognito124/my-markdown-parser:latest posts/*.md

docker-pull: nosqlite
	docker image pull ghcr.io/incognito124/my-markdown-parser:latest

nosqlite:
	rm -f db.sqlite3
