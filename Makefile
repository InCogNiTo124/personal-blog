chown: sqlite
	sudo chown $(shell id -u):$(shell id -g) db.sqlite3

sqlite: docker-pull
	docker container run --rm -v $(CURDIR)/posts/:/blog/posts/ ghcr.io/incognito124/my-markdown-parser:latest posts/*.md

docker-pull: nosqlite
	docker image pull ghcr.io/incognito124/my-markdown-parser:latest

nosqlite:
	rm -f db.sqlite3
