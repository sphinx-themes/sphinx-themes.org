..
   Copyright (c) 2021 Pradyun Gedam
   Licensed under Creative Commons Attribution-ShareAlike 4.0 International License
   SPDX-License-Identifier: CC-BY-SA-4.0

Directives in the Python domain
-------------------------------

The domain name is ``py``. See https://www.sphinx-doc.org/en/master/usage/domains/python.html.

.. py:module:: my_module
   :platform: platform1, platform2
   :synopsis: purpose
   :deprecated:

   The ``py:module`` directive, showing the docstring for the whole module.

   The second line of the module docstring.

.. py:function:: my_function(parameter: ParameterT = default_value) -> ReturnT
   :async:
   :canonical: my_module.my_function
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:function`` directive.

.. py:function:: my_function_type_parameters[ParameterT](parameter: ParameterT) -> ParameterT
   :async:
   :canonical: my_module.my_function_type_parameters
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:function`` directive, using Python 3.12 *type parameters*.

.. py:data:: my_data
   :type: type
   :value: initial_value
   :canonical: my_module.my_data

   The ``py:data`` directive.

.. py:exception:: MyException
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:exception`` directive.

.. py:exception:: MyExceptionFinal
   :final:
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:exception`` directive, ``final``.

.. py:exception:: MyException_type_parameters(parameters)
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:exception`` directive.

.. py:exception:: MyExceptionTypeParameters[ParameterT](parameter: ParameterT)
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:exception`` directive, using Python 3.12 *type parameters*.

.. py:class:: MyClass
   :canonical: my_module.MyClass
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:class`` directive.

.. py:class:: MyClassFinal
   :canonical: my_module.MyClassFinal
   :final:
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:class`` directive, ``final``.

.. py:class:: MyClassParameters(parameters)
   :canonical: my_module.MyClass2
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:class`` directive.

.. py:class:: MyClassTypeParameters[ParameterT](parameter: ParameterT)
   :canonical: my_module.MyClassTypeParameters
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:class`` directive, using Python 3.12 *type parameters*.

.. py:attribute:: my_attribute
   :type: type
   :value: initial_value
   :canonical: my_module.my_attribute

   The ``py:attribute`` directive.

.. py:property:: my_property
   :type: type

   The ``py:property`` directive.

.. py:property:: my_property2
   :abstractmethod:
   :classmethod:
   :type: type

   The ``py:property`` directive,
   using the ``:abstractmethod:`` and ``:classmethod:`` flags.

.. py:type:: MyType
   :canonical: my_module.MyType

   The ``py:type`` directive.

.. py:method:: my_method(parameters) -> ReturnT
   :canonical: my_module.my_method
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:method`` directive.

.. py:method:: my_method_type_parameters[ParameterT](parameter: ParameterT) -> ParameterT
   :abstractmethod:
   :async:
   :canonical: my_module.my_method_type_parameters
   :classmethod:
   :final:
   :single-line-parameter-list:
   :single-line-type-parameter-list:
   :staticmethod:

   The ``py:method`` directive,
   using all of the ``:abstractmethod:``, ``:async:``, ``:classmethod:``, ``:final:``, and ``:staticmethod:`` flags,
   using Python 3.12 *type parameters*.

.. py:staticmethod:: my_staticmethod(parameters)

   The ``py:staticmethod`` directive.

.. py:staticmethod:: my_staticmethod_type_parameters[ParameterT](parameter: ParameterT) -> ParameterT

   The ``py:staticmethod`` directive, using Python 3.12 *type parameters*.

.. py:classmethod:: my_classmethod(parameters)

   The ``py:classmethod`` directive.

.. py:classmethod:: my_classmethod_type_parameters[ParameterT](parameter: ParameterT) -> ParameterT

   The ``py:classmethod`` directive, using Python 3.12 *type parameters*.

.. py:decorator:: my_decorator
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:decorator`` directive.

.. py:decorator:: my_decorator_parameters(parameters)
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:decorator`` directive.

.. py:decorator:: my_decorator_type_parameters[ParameterT](parameter: ParameterT)
   :single-line-parameter-list:
   :single-line-type-parameter-list:

   The ``py:decorator`` directive, using Python 3.12 *type parameters*.

.. py:decoratormethod:: my_decoratormethod

   The ``py:decoratormethod`` directive.

.. py:decoratormethod:: my_decoratormethod_signature(signature)

   The ``py:decoratormethod`` directive.

.. py:decoratormethod:: my_decoratormethod_signature_type_parameters[ParameterT](signature)

   The ``py:decoratormethod`` directive, using Python 3.12 *type parameters*.
