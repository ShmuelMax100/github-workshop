"""
Solution for Exercise 1 — completed greet function added to the sample app.
"""


def add(a: int, b: int) -> int:
    return a + b


def subtract(a: int, b: int) -> int:
    return a - b


def multiply(a: int, b: int) -> int:
    return a * b


def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b


def greet(name: str) -> str:
    if not name or not name.strip():
        raise ValueError("Name must not be empty")
    return f"Hello, {name}!"


def fibonacci(n: int) -> list[int]:
    if n < 0:
        raise ValueError("n must be non-negative")
    if n == 0:
        return []
    if n == 1:
        return [0]
    seq = [0, 1]
    for _ in range(2, n):
        seq.append(seq[-1] + seq[-2])
    return seq
