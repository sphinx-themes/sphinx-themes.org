..
   Copyright (c) 2021 Pradyun Gedam
   Licensed under Creative Commons Attribution-ShareAlike 4.0 International License
   SPDX-License-Identifier: CC-BY-SA-4.0

Directives in the C domain
--------------------------

The domain name is ``c``. See https://www.sphinx-doc.org/en/master/usage/domains/c.html.

.. c:member:: PyObject *PyTypeObject.tp_bases

   The ``.. c:member::`` directive, showing a struct member.

.. c:var:: int my_var

   The ``.. c:var::`` directive, showing a variable.

.. c:function:: PyObject *PyType_GenericAlloc(PyTypeObject *type, Py_ssize_t nitems)

   The ``.. c:function::`` directive, showing a function. The signature should be given as in C.

   :param type: description of the first parameter.
   :param nitems: description of the second parameter.
   :returns: a result.
   :retval NULL: under some conditions.
   :retval NULL: under some other conditions as well.

.. c:macro:: MY_MACRO

   The ``.. c:macro::`` directive, showing a macro, i.e., a C-language ``#define``, without the replacement text.

.. c:macro:: MY_MACRO_ARGS(arg_list)
   :single-line-parameter-list:

   The ``.. c:macro::`` directive, showing a macro, i.e., a C-language ``#define``, without the replacement text.

.. c:struct:: MyStruct

   The ``.. c:struct::`` directive, showing a struct.

.. c:union:: MyUnion

   The ``.. c:union::`` directive, showing a union.

.. c:enum:: MyEnum

   The ``.. c:enum::`` directive, showing an enum.

.. c:enumerator:: myEnumerator

   The ``.. c:enumerator::`` directive, showing an enumerator.

.. c:type:: my_type

   The ``.. c:type::`` directive, showing a type.
