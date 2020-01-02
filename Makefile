IMG=sphinx-themes:base

build:
	docker build -t $(IMG) .

run:
	docker run --rm \
		-v `pwd`:/volume \
		$(IMG) /tmp/build.sh $(PKG_NAME) $(THEME) $(IMPORT)
	sudo chown -R $(USER) html
	chmod -R ugo+r html

	python scripts/db.py
	cd js && npm install && npm run build -p

jsbuild:
	cd js && npm install && npm run build
	/bin/rm -f *.js *.map *.css index.html && mv js/dist/* .

dev:
	docker run -it --rm \
		-v `pwd`:/volume \
		$(IMG) bash

rm:
	sudo rm -rf html/$(PKG_NAME)
	sudo rm -rf src/$(PKG_NAME)


upload:
	rsync --exclude .git --exclude js/node_modules -auvz --delete . -e ssh sphinx-themes.org:www/sphinx-themes
