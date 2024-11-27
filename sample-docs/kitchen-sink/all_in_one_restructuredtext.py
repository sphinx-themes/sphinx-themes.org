"""
This is the module-level docstring of the module :py:mod:`all_in_one_restructuredtext`.

The module's docstrings use reStructuredText markup.
"""

# TODO:
# - show roles to refer to elements
# - async with
# - async for
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


def my_function_pure_sphinx(*args, **kwargs):
    r'''
    This function accepts any number of arguments and keyword arguments.

    Note:
        If you do *not* use ``sphinx.ext.napoleon``:

        In the source code,
        the docstring for this function is a "raw" docstring using ``r"""..."""``,
        and ``*args`` and ``**kwargs`` below are escaped with a backslash
        (``\*args`` and ``\*\*kwargs``).

        See also https://github.com/sphinx-doc/sphinx/issues/9893.

    :param \*args: Variable length argument list.
    :param \*\*kwargs: Arbitrary keyword arguments.

    :return: None

    Text at end of docstring.
    '''
    pass


def my_function_google_style(*args, **kwargs):
    r'''
    This function accepts any number of arguments and keyword arguments.

    Note:
        If you do *not* use ``sphinx.ext.napoleon``:

        In the source code,
        the docstring for this function is a "raw" docstring using ``r"""..."""``,
        and ``*args`` and ``**kwargs`` below are escaped with a backslash
        (``\*args`` and ``\*\*kwargs``).

        See also https://github.com/sphinx-doc/sphinx/issues/9893.

    Args:
        \*args: Variable length argument list.
        \*\*kwargs: Arbitrary keyword arguments.

    Returns:
        None

    Text at end of docstring.
    '''
    pass


def my_function_needs_napoleon(*args, **kwargs):
    """
    This function accepts any number of arguments and keyword arguments.

    Note:
        If you use ``sphinx.ext.napoleon`` (and only then),
        there is no need to escape ``*args`` and ``**kwargs`` below.

    Args:
        *args: Variable length argument list.
        **kwargs: Arbitrary keyword arguments.

    Returns:
        None

    Text at end of docstring.
    """
    pass


def my_function2(foo: int, bar: str):
    """
    A simple function.

    Args:
        foo: A regular argument.
        bar: Another regular argument.

    Returns:
        None

    .. deprecated:: 2.0
        Use :func:`my_function_pure_sphinx` instead.

    Text at end of docstring.
    """
    pass


def my_generator():
    """A generator.

    Yields:
        None
    """
    yield None


class MyException(Exception):
    """Custom exception class."""

    pass


class AllInOne:
    """This is a class that demonstrates various Python features.

    Uses Google-style docstrings
    (https://www.sphinx-doc.org/en/master/usage/extensions/example_google.html).


    Attributes:
        _my_property: A private property of the class.
    """

    __metaclass__ = abc.ABCMeta

    def __init__(self):
        """Initialize the :py:class:`AllInOne` class."""
        pass

    def my_method(self, my_param: ParameterT = "default_value", /, *, keyword_only_param=None) -> ReturnT:
        """A normal method.

        We are using both positional-only and keyword-only syntax.

        Here is some code in a literal block::

            foo = True  # assign ``True``

        Note:
            Do not include the *self* parameter in the ``Args`` section.

        Args:
            my_param: Documenting *my_param*.
                Another sentence on the next docstring line, still belonging to *my_param*.
            keyword_only_param: Documenting *keyword_only_param*.
                Another sentence on the next docstring line, still belonging to *keyword_only_param*.

        Returns:
            The value of the local variable ``my_var``.

        Raises:
            :py:exc:`MyException`: if something went wrong.

        Example:
            >>> retval = my_method()  # doctest format
            "return_value"

        Text at end of docstring.
        """
        my_var: ReturnT = "return_value"
        return my_var

    async def my_async_method(self, my_param: ParameterT = "default_value") -> ReturnT:
        """An :term:`async` method.

        Text at end of docstring.
        """
        self.my_var: ReturnT = "return_value"
        return self.my_var

    @abc.abstractmethod
    def my_abstractmethod(my_param: ParameterT = "default_value") -> ReturnT:
        """An abstract method.

        Text at end of docstring.
        """
        my_var: ReturnT = "return_value"
        return my_var

    @classmethod
    def my_classmethod(cls, my_param: ParameterT = "default_value") -> ReturnT:
        """A :any:`classmethod`.

        Text at end of docstring.
        """
        my_var: ReturnT = "return_value"
        return my_var

    @staticmethod
    def my_staticmethod(my_param: ParameterT = "default_value") -> ReturnT:
        """A :any:`staticmethod`.

        Text at end of docstring.
        """
        my_var: ReturnT = "return_value"
        return my_var

    @property
    def my_property(self):
        """
        Getter for the private property :py:attr:`_my_property`.

        Returns:
            The value of :py:attr:`_my_property`.

        Text at end of docstring.
        """
        return self._my_property

    @my_property.setter
    def my_property(self, value):
        """
        Setter for the private property :py:attr:`_my_property`.

        Args:
            value: The value to set :py:attr:`_my_property` to.

        Text at end of docstring.
        """
        self._my_property = value

    def my_decorator_method(method):
        """
        A decorator method that wraps the provided method.

        Args:
            method: The method to decorate.

        Returns:
            The decorated method.

        Text at end of docstring.
        """

        def decorate_method():
            """The decorated method."""
            method()

        return decorate_method

    @my_decorator_method
    def my_decorated_method():
        """A method that is decorated by :py:meth:`my_decorator_method`."""
        pass


@final
class MyFinalClass:
    """A class that cannot be subclassed."""

    @final
    def my_final_method(self) -> None:
        """A method that cannot be overridden by subclasses."""
        pass


def my_decorator_function(function):
    """
    A decorator function that wraps the provided function.

    Args:
        function: The function to decorate.

    Returns:
        The decorated function.

    Text at end of docstring.
    """

    def decorate_function():
        """The decorated function."""
        function()

    return decorate_function


@my_decorator_function
def my_decorated_function():
    """
    A function that is decorated by the :py:func:`my_decorator_function`.

    This docstring is not shown, just the one of ``decorate_function()``.
    """
    pass
