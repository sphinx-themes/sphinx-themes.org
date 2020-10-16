===========================
Sample Sphinx Documentation
===========================

This is a *very* rudimentary sample page for Sphinx based documentation.

In case you're looking for a lot of fairly extensive pages, that stretch the
theme in as many reasonable ways as possible, consider scrolling right to the
end of this page and looking at the Demo Documentation below.

Quick Inline Markup Demo
========================

Inline markup in reStructuredText is pretty powerful. You can have *emphasis*,
**strong emphasis**, ``inline literals``, external hyperlinks with embedded
URIs (`Python web site <http://www.python.org>`__) standalone hyperlinks
(http://www.python.org), footnote references [1]_ and so much more. Sometimes,
you even have some |problematic| text that doesn't do the right things but
Sphinx still builds your page.

Often, you'll have multiple paragraphs of text in your documentation, possibly
an explanation how stuff works. Here are some explicit interpreted text roles:
a PEP reference (:PEP:`287`); a :sub:`subscript`; a :sup:`superscript`; and
explicit roles for :emphasis:`standard` :strong:`inline` :literal:`markup`.

.. note::
    You may want to know what admonitions look like.

.. important::
    I just wanted to interrupt your very relevant insight, to assert my
    importance.

Or, maybe, you want to present a code block to the user.

.. code-block:: python
    :linenos:
    :emphasize-lines: 6,9

    """Just a small code example"""

    class Demo:
        def __init__(self):
            super().__init__()
            self.ready = True

        def how_ready_are_we(self) -> str:
            return "very" if self.ready else "not at all"

.. toctree::
    :maxdepth: 2
    :caption: Demo Documentation

    demo/structure
    demo/demo
    demo/lists_tables
    demo/api

.. toctree::
    :maxdepth: 3
    :caption: This is an incredibly long caption for a long menu

    demo/long
