sqlite:
	docker build -f deploy/Dockerfile-markdown-to-sqlite deploy | grep "Successfully built" | sed 's/Successfully built //g' | xargs -I{} docker run --rm -u $(shell id -u):$(shell id -g) -v $(CURDIR):/blog {} posts/*.md
