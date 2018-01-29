#!/usr/bin/env bash

set -e

ROOT="/volume"

PKG_NAME=$1
THEME=$2
IMPORT=$3


pip3 install $PKG_NAME


if [ ! -d ${ROOT}/src/$PKG_NAME/${THEME} ]; then
    mkdir -p ${ROOT}/src/$PKG_NAME
    cp -rp ${ROOT}/template ${ROOT}/src/$PKG_NAME/${THEME}

    echo "html_theme = '${THEME}'" >> ${ROOT}/src/$PKG_NAME/${THEME}/conf.py

    if [ ! -z $IMPORT ]; then
       I=`echo $PKG_NAME | tr "-" "_" `
       echo "import ${I}" >> ${ROOT}/src/$PKG_NAME/${THEME}/conf.py
       echo "html_theme_path = [$I.get_html_theme_path()]" >> ${ROOT}/src/$PKG_NAME/${THEME}/conf.py
    fi
fi

# edit conf.py manually if needed.

if [ ! -d ${ROOT}/html/$PKG_NAME/${THEME} ]; then
    cd ${ROOT}/src/$PKG_NAME/${THEME} && make html

    mkdir -p ${ROOT}/html/$PKG_NAME
    mv ${ROOT}/src/$PKG_NAME/${THEME}/_build/html ${ROOT}/html/$PKG_NAME/${THEME}
    rm -rf ${ROOT}/src/$PKG_NAME/${THEME}/_build

    t=`date -u +"%Y-%m-%dT%H:%M:%SZ"`
    J=`cat <<EOF
    {
        "pkg_name": "${PKG_NAME}",
        "theme": "${THEME}",
        "url": "https://pypi.python.org/pypi/${PKG_NAME}",
        "tag": ["${PKG_NAME}"],
        "created": "${t}",
        "updated": "${t}"
    }
EOF`
    echo $J > ${ROOT}/html/$PKG_NAME/${THEME}/meta.json

fi

if [ ! -d ${ROOT}/html/$PKG_NAME/${THEME}/screenshot.png ]; then
    cd ${ROOT}/html/$PKG_NAME/${THEME}
    /usr/bin/chromium-browser --headless --disable-gpu --no-sandbox --screenshot basic.html
fi
