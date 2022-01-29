deploy: sqlite
	docker-compose up --build -d -t 0

restart: sqlite
	docker-compose restart -t 0 blog

sqlite: nosqlite
	docker build -f deploy/Dockerfile-compile deploy | grep "Successfully built" | sed 's/Successfully built //g' | xargs -I{} docker run --rm -u $(shell id -u):$(shell id -g) -v $(CURDIR):/blog {} posts/*.md

nosqlite: showstopper
	rm -f db.sqlite3

showstopper:
	docker-compose stop -t 0
