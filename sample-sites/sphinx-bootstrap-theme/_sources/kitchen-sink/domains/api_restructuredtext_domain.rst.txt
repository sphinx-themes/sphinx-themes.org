..
   Copyright (c) 2021 Pradyun Gedam
   Licensed under Creative Commons Attribution-ShareAlike 4.0 International License
   SPDX-License-Identifier: CC-BY-SA-4.0

Directives in the reStructuredText domain
-----------------------------------------

The domain name is ``rst``. See https://www.sphinx-doc.org/en/master/usage/domains/restructuredtext.html.

.. rst:directive:: my_directive

   The ``.. rst:directive::`` directive, showing the directive ``my_directive``.

.. rst:directive:: .. my_directive2:: my_argument

   The ``.. rst:directive::`` directive, showing the directive ``my_directive2`` with argument ``my_argument``.

.. rst:directive:: my_directive3

   The ``.. rst:directive::`` directive, showing the directive ``my_directive3``.

   .. rst:directive:option:: my_option1

   .. rst:directive:option:: my_option2: my_argument

      The ``.. rst:directive:option::`` directive, showing the directive option ``my_option2`` that has an argument.

   .. rst:directive:option:: my_option3: my_argument2
      :type: my_argument2_type

      The ``.. rst:directive:option::`` directive, showing the directive option ``my_option3`` that has an argument with a type definition.

.. rst:role:: role_name

   The ``.. rst:role::`` directive, showing a role.
