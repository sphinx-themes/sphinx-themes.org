..
   Copyright (c) 2021 Pradyun Gedam
   Licensed under Creative Commons Attribution-ShareAlike 4.0 International License
   SPDX-License-Identifier: CC-BY-SA-4.0

Directives in the C++ domain
----------------------------

The domain name is ``cpp``. See https://www.sphinx-doc.org/en/master/usage/domains/cpp.html.

The following directives are available. All declarations can start with a
visibility statement, ``public``, ``private``, or ``protected``.

.. cpp:class:: MyClass : public MyBase, MyOtherBase

   The ``.. cpp:class::`` directive, showing a class or struct.

.. cpp:class:: OuterScope::MyClass2 : public MyBase, MyOtherBase

   The ``.. cpp:class::`` directive, showing a class or struct.

.. cpp:class:: template<typename T, std::size_t N> std::array

   The ``.. cpp:class::`` directive, showing a class or struct.

.. cpp:class:: template<> std::array2<bool, 256>

   The ``.. cpp:class::`` directive, showing a class or struct.

.. cpp:class:: template<typename T> std::array3<T, 42>

   The ``.. cpp:class::`` directive, showing a class or struct.

.. cpp:function:: bool myMethod(int arg1, std::string arg2)

   The ``.. cpp:function::`` directive, showing a function or member function with parameters and types.

.. cpp:function:: bool myMethod2(int, double)

   The ``.. cpp:function::`` directive, showing a function or member function with unnamed parameters.

.. cpp:function:: const T &MyClass::operator[](std::size_t i) const

   The ``.. cpp:function::`` directive, showing an overload for the indexing operator.

.. cpp:function:: operator bool() const

   The ``.. cpp:function::`` directive, showing a casting operator.

.. cpp:function:: constexpr void my_constexpr_function(std::string &bar[2]) noexcept

   The ``.. cpp:function::`` directive, showing a ``constexpr`` function.

.. cpp:function:: MyClass::MyClass4(const MyClass&) = default

   The ``.. cpp:function::`` directive, showing a copy constructor with default implementation.

.. cpp:function:: template<typename U> void my_function_template(U &&u)

   The ``.. cpp:function::`` directive, showing a function template.

.. cpp:function:: template<> void my_function_template_specialisation(int i)

   The ``.. cpp:function::`` directive, showing a function template specialisation.

.. cpp:member:: std::string MyClass::myMember

   The ``.. cpp:member::`` directive, showing a variable or member variable.

.. cpp:var:: std::string MyClass::myOtherMember[N][M]

   The ``.. cpp:var::`` directive, showing a variable.

.. cpp:member:: int my_member_variable = 42

   The ``.. cpp:member::`` directive, showing a member variable.

.. cpp:member:: template<class T> constexpr T my_constexpr = T(3.1415926535897932385)

   The ``.. cpp:member::`` directive, showing a variable template.

.. cpp:type:: std::vector<int> MyListType

   The ``.. cpp:type::`` directive, showing a ``typedef``-like declaration of a type.

.. cpp:type:: MyContainerType::const_iterator

   The ``.. cpp:type::`` directive, showing a declaration of a type alias with unspecified type.

.. cpp:type:: MyTypeAlias = std::unordered_map<int, std::string>

   The ``.. cpp:type::`` directive, showing a declaration of a type alias.

.. cpp:type:: template<typename T> MyTemplatedTypeAlias = std::vector<T>

   The ``.. cpp:type::`` directive, showing a templated type alias.

.. cpp:enum:: MyEnum

   The ``.. cpp:enum::`` directive, showing an unscoped enum.

.. cpp:enum:: MySpecificEnum : long

   The ``.. cpp:enum::`` directive, showing an unscoped enum with specified underlying type.

.. cpp:enum-class:: MyScopedEnum

   The ``.. cpp:enum-class::`` directive, showing a scoped enum.

.. cpp:enum-struct:: protected MyScopedVisibilityEnum : std::underlying_type<MySpecificEnum>::type

   The ``.. cpp:enum-struct::`` directive, showing a scoped enum with non-default visibility, and with a specified underlying type.

.. cpp:enumerator:: MyEnum::myEnumerator

   The ``.. cpp:enumerator::`` directive, showing an enumerator.

.. cpp:enumerator:: MyEnum::myOtherEnumerator = 42

   The ``.. cpp:enumerator::`` directive, showing a enumerator with a value.

.. cpp:union:: my_union

   The ``.. cpp:union::`` directive, showing a union.

.. cpp:concept:: template<typename It> std::Iterator

   The ``.. cpp:concept::`` directive, showing a proxy to an element of a notional sequence.

   - :cpp:expr:`*r`, when :cpp:expr:`r` is dereferenceable.
   - :cpp:expr:`++r`, with return type :cpp:expr:`It&`, when
     :cpp:expr:`r` is incrementable.

.. cpp:alias:: myAlias myMethod(int arg1, std::string arg2)

   The ``.. cpp:alias::`` directive, showing an alias declaration.
