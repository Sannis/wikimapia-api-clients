# Simple Makefile

test:
	nodeunit ./test

lint:
	nodelint ./lib/*.js ./test/*.js

.PHONY: test lint