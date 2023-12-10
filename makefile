all: build
startup: build-runtime intall

.PHONY: build-runtime
build-runtime:
	DOCKER_BUILDKIT=1 docker build --progress=plain -t powerstrings .

.PHONY: install
install:
	docker-compose run --no-deps powerstrings npm install

.PHONY: ci
ci:
	docker-compose run --no-deps powerstrings npm ci

.PHONY: build
build:
	docker-compose run --no-deps powerstrings npm run build

.PHONY: lint
lint:
	docker-compose run --no-deps powerstrings npm run lint

.PHONY: dev
dev:
	docker-compose up -d --no-deps --force-recreate powerstrings
	@printf "\nDev Server \033[0;32mstarting...\n\033[0;34mhttp://localhost:5173\n"
	@printf "\033[0;37mThe application should be online in a few seconds.\n\n"