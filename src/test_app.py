"""
Tests for the sample application.
Used in workshop exercises to demonstrate CI test runs and debugging.
"""

import pytest
from app import add, subtract, multiply, divide, greet, fibonacci


# ── Arithmetic ─────────────────────────────────────────────────────────────────

def test_greet():
    assert greet("SecuriThings") == "Hello, SecuriThings! Welcome to the GitHub workshop."
    
def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0


def test_subtract():
    assert subtract(10, 4) == 6
    assert subtract(0, 5) == -5


def test_multiply():
    assert multiply(3, 4) == 12
    assert multiply(-2, 5) == -10
    assert multiply(0, 100) == 0


def test_divide():
    assert divide(10, 2) == 5.0
    assert divide(7, 2) == 3.5


def test_divide_by_zero():
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(5, 0)


# ── Greet ──────────────────────────────────────────────────────────────────────

def test_greet():
    assert greet("Alice") == "Hello, Alice!"
    assert greet("SecuriThings") == "Hello, SecuriThings!"


def test_greet_empty_name():
    with pytest.raises(ValueError, match="Name must not be empty"):
        greet("")

    with pytest.raises(ValueError, match="Name must not be empty"):
        greet("   ")


# ── Fibonacci ──────────────────────────────────────────────────────────────────

def test_fibonacci_base_cases():
    assert fibonacci(0) == []
    assert fibonacci(1) == [0]
    assert fibonacci(2) == [0, 1]


def test_fibonacci_sequence():
    assert fibonacci(8) == [0, 1, 1, 2, 3, 5, 8, 13]


def test_fibonacci_negative():
    with pytest.raises(ValueError, match="n must be non-negative"):
        fibonacci(-1)
