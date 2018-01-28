#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import os
import sys

json_file = "data/data.json"
meta = "meta.json"


def write(fname: str, content: list):
    with open(fname, "w") as fp:
        json.dump(content, fp)

def read(fname: str) -> list:
    with open(fname) as fp:
        return json.load(fp)

def get_all(top: str) -> list:
    ret = []

    for pkg_name in os.listdir(top):
        for theme in os.listdir(os.path.join(top, pkg_name)):
            with open(os.path.join(top, pkg_name, theme, meta)) as fp:
                t = json.load(fp)
                ret.append(t)

    return ret


if __name__ == '__main__':
    c = get_all("html")
    write(json_file, c)
