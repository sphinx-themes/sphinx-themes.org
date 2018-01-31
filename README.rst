Sphinx Themes
===============

https://sphinx-themes.org

Sphinx Theme collections.

How to contribute
---------------------------

When you find new theme in PyPI
````````````````````````````````````````````````

Please file an issue. Currently, themes are updated by hands only.

How to add new Theme
````````````````````````

Requirements: Docker

1. git clone
2. make build (it may take more than 20min)
3. PKG_NAME= `<pass pkg-name>` THEME= `<pass theme name>` make build run

   3.1 if something fail, edit `src/pkg-name/theme/conf.py` and retry.

4. add that package name to log.csv
5. git add html src log.csv
6. git commit
7. make PR

Package name and theme name is sometimes different. You'd better read the homepage before to run.


License
-------------

BSD License (same as Sphinx)
