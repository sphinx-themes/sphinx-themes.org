====================
Sample Documentation
====================

This is a demo documentation set from the `Sphinx Themes Gallery <https://sphinx-themes.org>`_. While this ``index.rst`` file gets overwritten for sample sites on the gallery, it is made available so that documentation themes can reuse it.

Kitchen Sink
============

Where every element of the themes has been dumped.

.. toctree::
    :titlesonly:

    kitchen-sink/index

Navigation
==========

A bunch of separate toctrees to demonstrate navigation elements, especially for themes that support segmented navigation by toctrees.

.. toctree::
    :caption: This is a caption
    :titlesonly:

    placeholder-one
    placeholder-two
    really-long-title
    long-page
    External Link <https://www.sphinx-doc.org>

.. toctree::
    :hidden:
    :caption: Additional "hidden" Pages

    placeholder-three
    placeholder-four
    Sphinx Theme Gallery <https://sphinx-themes.org>

Some pages like :doc:`placeholder-three` are declared in a "hidden"
toctree, and thus would not be visible above. However, they are still a
part of the overall site hierarchy and some themes may choose to present
them to the user in the site navigation.
