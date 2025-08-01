..
   Copyright (c) 2021 Pradyun Gedam
   Licensed under Creative Commons Attribution-ShareAlike 4.0 International License
   SPDX-License-Identifier: CC-BY-SA-4.0

*****************
API documentation
*****************

    A domain is a collection of markup (directives and roles) to describe and link to objects belonging together,
    e.g. elements of a programming language.

    -- https://www.sphinx-doc.org/en/master/usage/domains/index.html

The following sections show examples of the domains built-in to Sphinx.

.. toctree::
    :titlesonly:
    :glob:

    domains/api_*_domain

Using autodoc
=============

Using Sphinx's :any:`sphinx.ext.autodoc` plugin, it is possible to auto-generate documentation of a Python module.

.. tip::
    Avoid having in-function-signature type annotations with autodoc,
    by setting the following options:

    .. code-block:: python

        # -- Options for autodoc ----------------------------------------------------
        # https://www.sphinx-doc.org/en/master/usage/extensions/autodoc.html#configuration

        # Automatically extract typehints when specified and place them in
        # descriptions of the relevant function/method.
        autodoc_typehints = "description"

        # Don't show class signature with the class' name.
        autodoc_class_signature = "separated"


The ``automodule`` Directive with reStructuredText Markup
---------------------------------------------------------

What follows after the line is an example showing usage of the ``.. automodule::`` directive.

---

.. currentmodule:: all_in_one_restructuredtext

.. automodule:: all_in_one_restructuredtext
    :members:
    :member-order: bysource
