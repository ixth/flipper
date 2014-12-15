NPM_BIN=./node_modules/.bin

static:
	$(NPM_BIN)/stylus --resolve-url --include-css css/style.styl

.PHONY: static
