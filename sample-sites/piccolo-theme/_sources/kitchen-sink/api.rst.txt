..
   Copyright (c) 2021 Pradyun Gedam
   Licensed under Creative Commons Attribution-ShareAlike 4.0 International License
   SPDX-License-Identifier: CC-BY-SA-4.0

*****************
API documentation
*****************

A domain is a collection of markup, consisting of directives and roles,
that describe and link to objects belonging together,
such as elements of a programming language.

.. seealso::

    `Domains <https://www.sphinx-doc.org/en/master/usage/domains/index.html>`_

The following sections show examples of the built-in domains of Sphinx.

.. toctree::
    :titlesonly:
    :glob:

    domains/api_*_domain

Using autodoc
=============

Using Sphinx's :any:`sphinx.ext.autodoc` plugin,
it is possible to auto-generate documentation of a Python module.

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

The following markup is an example of the ``automodule`` directive.
Note that the ``currentmodule`` directive sets the current module.

.. code-block:: rst

    .. currentmodule:: all_in_one_restructuredtext

    .. automodule:: all_in_one_restructuredtext
        :members:
        :member-order: bysource

The foregoing markup example renders as shown below.

.. currentmodule:: all_in_one_restructuredtext

.. automodule:: all_in_one_restructuredtext
    :members:
    :member-order: bysource
