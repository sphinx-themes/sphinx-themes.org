"""
This is the module-level docstring of the module :py:mod:`all_in_one_restructuredtext`.

The module's docstrings use reStructuredText markup.
"""

# TODO:
# - show roles to refer to elements
# - async with
# - async for
# - *args, **kwargs
# - Python 3.12 type parameters
# - add example of numpy-style docstrings

import abc
from typing import final, TypeAlias, TypeVar


ParameterT = TypeVar("ParameterT")  #: Docstring of type ParameterT

ReturnT = TypeVar("ReturnT")
"""Docstring of type ReturnT."""

# Python 3.12: type MyType = list[float]  #: The docstring.
MyType: TypeAlias = list[float]  #: The docstring.

my_module_level_variable: MyType = [0.0, 1.1]  #: The docstring.


def my_function(*args, **kwargs):
    """TODO.

    Args:
        *args: Variable length argument list. FIXME: parse error?
        **kwargs: Arbitrary keyword arguments. FIXME: parse error?

    Returns:
        Nothing.
    """
    pass


def my_generator():
    """TODO.

    Yields:
        Nothing.
    """
    yield None


class MyException(Exception):
    """TODO."""

    pass


class AllInOne:
    """TODO.

    Google-style docstrings
    (https://www.sphinx-doc.org/en/master/usage/extensions/example_google.html).


    Attributes:
        _my_property: TODO.
    """

    __metaclass__ = abc.ABCMeta

    def __init__(self):
        """TODO."""

    def my_method(self, my_param: ParameterT = "default_value", /, *, keyword_only_param=None) -> ReturnT:
        """TODO.

        We are using both positional-only and keyword-only syntax.

        Here is some code in a literal block::

            foo = True  # assign ``True`` to ``foo``

        Note:
            Do not include the *self* parameter in the ``Args`` section.

        Args:
            my_param: Documenting *my_param*.
                Another sentence on the next line, still belonging to *my_param*.
            keyword_only_param: Documenting *keyword_only_param*.
                Another sentence on the next line, still belonging to *keyword_only_param*.

        Returns:
            TODO

        Raises:
            :py:exc:`MyException`: if something went wrong.

        Example:
            >>> retval = my_method()  # doctest format
            "return_value"

        Text at end of docstring.
        """
        self.my_var: ReturnT = "return_value"
        return self.my_var

    async def my_async_method(self, my_param: ParameterT = "default_value") -> ReturnT:
        """TODO.

        Text at end of docstring.
        """
        self.my_var: ReturnT = "return_value"
        return self.my_var

    @abc.abstractmethod
    def my_abstractmethod(my_param: ParameterT = "default_value") -> ReturnT:
        """TODO.

        Text at end of docstring.
        """
        my_var: ReturnT = "return_value"
        return my_var

    @classmethod
    def my_classmethod(cls, my_param: ParameterT = "default_value") -> ReturnT:
        """TODO.

        Text at end of docstring.
        """
        my_var: ReturnT = "return_value"
        return my_var

    @staticmethod
    def my_staticmethod(my_param: ParameterT = "default_value") -> ReturnT:
        """TODO.

        Text at end of docstring.
        """
        my_var: ReturnT = "return_value"
        return my_var

    @property
    def my_property(self):
        """TODO."""
        return self._my_property

    @my_property.setter
    def my_property(self, value):
        """TODO."""
        self._my_property = value

    def my_decorator_method(method):
        """TODO."""

        def decorate_method():
            """TODO."""
            method()

        return decorate_method

    @my_decorator_method
    def my_decorated_method():
        """TODO."""
        pass


@final
class MyFinalClass:
    """TODO."""

    @final
    def my_final_method(self) -> None:
        """TODO."""
        pass


def my_decorator_function(function):
    """TODO."""

    def decorate_function():
        """TODO."""
        function()

    return decorate_function


@my_decorator_function
def my_decorated_function():
    """TODO."""
    pass
