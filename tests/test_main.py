import sys
from io import StringIO
from app.main import hello_world

def test_hello_world(capsys):
    hello_world()
    captured = capsys.readouterr()
    assert captured.out == "hello world\n"
