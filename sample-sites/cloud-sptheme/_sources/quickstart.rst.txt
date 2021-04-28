==========
Quickstart
==========

1. Install this theme:

   .. theme-install::

2. Set the following in your existing Sphinx documentation's ``conf.py`` file:

   .. theme-configuration::

3. Build your Sphinx documentation.
4. Done!

Troubleshooting
===============

If you hit an error in step 3 above (and not with the previous theme),
that's likely because you have some theme-specific configuration in your
``conf.py`` file.

Some theme-specific configuration options might not work if you're changing
the theme for existing documentation. Common tripping points include:

- ``html_sidebars``, since it depends on theme-specific ``.html`` files
- ``html_theme_options``, since it depends on theme-specific configuration options

Certain extensions may misbehave with certain themes. It is a good idea to
check that your extensions work as expected.
