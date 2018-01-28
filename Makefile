IMG=sphinx-themes:base

build:
	docker build -t $(IMG) .

run:
	docker run --rm \
		-v `pwd`:/volume \
		$(IMG) /tmp/build.sh $(PKG_NAME) $(THEME)
	sudo chown -R $(USER) html
	chmod -R ugo+r html

	python scripts/db.py
	cd js && npm run build -p

jsbuild:
	cd js && npm run build -p

dev:
	docker run -it --rm \
		-v `pwd`:/volume \
		$(IMG) bash


upload:
	rsync --exclude .git --exclude js/node_modules -auvz --delete . -e ssh sphinx-themes.org:www/sphinx-themes
