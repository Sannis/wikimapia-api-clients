dependencies: stamp-dependencies

stamp-dependencies:
	touch stamp-dependencies;
	npm install

devdependencies: stamp-devdependencies

stamp-devdependencies:
	touch stamp-devdependencies;
	touch stamp-dependencies;
	npm install --dev

test: devdependencies
	./node_modules/.bin/nodeunit ./test/test-*.js

lint: devdependencies
	./node_modules/.bin/nodelint ./lib/ ./test/

lint-package-json: devdependencies
	./node_modules/.bin/nodelint ./package.json

.PHONY: test lint
