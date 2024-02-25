build: frontend posts blog-db-server
	docker compose down && docker compose up -d

frontend:
	docker image build -f Dockerfile -t ghcr.io/incognito124/personal-blog:latest .

blog-db-server:
	docker image build -f database/Dockerfile -t ghcr.io/incognito124/personal-blog-server:latest database/

posts: blog-db-server
	docker image build -f database/Dockerfile_posts -t ghcr.io/incognito124/personal-blog-db:latest .
