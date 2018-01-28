Sphinx Themes
===============

Sphinx Theme collections.

How to contribute
---------------------------

How to add new Theme
````````````````````````

Requirements: Docker

1. git clone
2. make build
3. PKG_NAME=`<pass pkg-name>` THEME=`<pass theme name>` make build run
4. add that package name to log.csv
5. git add html src log.csv
5. git commit
5. make PR

Some of packages have multiple themes. So we separete package name and themes.


License
-------------

BSD License (same as Sphinx)
