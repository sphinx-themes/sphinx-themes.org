..
   Copyright (c) 2021 Pradyun Gedam
   Licensed under Creative Commons Attribution-ShareAlike 4.0 International License
   SPDX-License-Identifier: CC-BY-SA-4.0

Directives in the JavaScript domain
-----------------------------------

The domain name is ``js``. See https://www.sphinx-doc.org/en/master/usage/domains/javascript.html.

.. js:function:: $.myFunction(href, callback[, errback])

   The ``.. js:function::`` directive, showing a JavaScript function or method.

   :param string href: An URI to the location of the resource.
   :param callback: Gets called with the object.
   :param errback:
       Gets called in case the request fails. And a lot of other
       text so we need multiple lines.
   :throws SomeError: For whatever reason in that case.
   :returns: Something.

.. js:method:: $.myMethod(href, callback[, errback])

   The ``.. js:method::`` directive (an alias for ``.. js:function::``,
   showing a function that is implemented as a method on a class object.

.. js:class:: MyClass(name[, num])

   The ``.. js:class::`` directive, showing a JavaScript object.

   :param string name: A name
   :param number num: An optional number

.. js:data:: my_variable

   The ``.. js:data::`` directive, showing a global variable or constant.

.. js:attribute:: object.name

   The ``.. js:attribute::`` directive, showing an attribute *name* of *object*.
