.. highlight:: console

Sphinx Themes
===============

https://sphinx-themes.org

Sphinx Theme collections.

How to contribute
---------------------------

When you find new theme on PyPI_, please `file an issue`_.
Currently, themes are updated by hands only.

.. _file an issue: https://github.com/sphinx-themes/sphinx-themes.org/issues
.. _PyPI: https://pypi.org

How to add a new theme
````````````````````````

.. role:: python(code)
   :language: python

Requirements:

* ``docker``
* ``parcel`` (``sudo npm install -g parcel-bundler``)

1. Fork the sphinx-themes.org repository
2. Clone your fork::

    $ git clone https://github.com/<your-username>/sphinx-themes.org

3. Create a new branch for your new theme::

    $ git checkout -b "Add <pypi-pkg-name-of-theme>"

4. Build the docker container (this may take a long time)::

    $ make build

5. Generate assets for your new theme::

    $ PKG_NAME=<pypi-pkg-name-of-theme> THEME=<sphinx-theme-name> make build run

   **Note:** ``<pypi-pkg-name-of-theme>`` and ``<sphinx-theme-name>`` are sometimes different. Make sure to read the theme's documentation.

   * ``<pypi-pkg-name-of-theme>`` is the name you use to install the package (``pip install <pypi-pkg-name-of-theme>``)
   * ``<sphinx-theme-name>`` is the name you use in your sphinx ``conf.py`` (:python:`html_theme = '<sphinx-theme-name>'`)

   If something fails, check and edit the generated ``src/<pypi-pkg-name-of-theme>/<sphinx-theme-name>/conf.py`` manually and retry.

6. Add an entry with the ``<pypi-pkg-name-of-theme>`` to ``log.csv``
7. Commit and push your changes::

    $ git add html src log.csv
    $ git commit -m "Add <pypi-pkg-name-of-theme>"
    $ git push

8. Make a `Pull Request`_ on GitHub

.. _Pull Request: https://github.com/sphinx-themes/sphinx-themes.org/pulls

License
-------------

BSD License (same as ``Sphinx``)
