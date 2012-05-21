SUBDIRS = php nodejs

install:
	for dir in $(SUBDIRS); do\
		cd $$dir; $(MAKE) install; cd -; \
	done

test: install
	for dir in $(SUBDIRS); do\
		cd $$dir && $(MAKE) test && cd -; \
	done

clean:
	for dir in $(SUBDIRS); do\
		cd $$dir; $(MAKE) clean; cd -; \
	done

.PHONY: install test clean
