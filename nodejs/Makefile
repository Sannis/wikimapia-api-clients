install: stamp-install

stamp-install:
	$(MAKE) clean dependencies devdependencies
	touch stamp-install

dependencies: stamp-dependencies

stamp-dependencies:
	touch stamp-dependencies
	npm install

devdependencies: stamp-devdependencies

stamp-devdependencies:
	touch stamp-devdependencies
	touch stamp-dependencies
	npm install

test: install
	./node_modules/.bin/nodeunit ./test/test-*.js

clean:
	rm -f stamp-install
	rm -f stamp-dependencies
	rm -f stamp-devdependencies
	rm -rf build
	rm -rf node_modules

lint: devdependencies
	./node_modules/.bin/nodelint ./lib/ ./test/

lint-package-json: devdependencies
	./node_modules/.bin/nodelint ./package.json

.PHONY: install test clean lint
