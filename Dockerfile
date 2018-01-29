From ubuntu:16.04

RUN apt update

RUN apt install -y python3-pip unzip udev chromium-browser ttf-freefont wget vim-tiny

RUN mkdir /noto && \
    cd /noto && \
    wget https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip && \
    unzip NotoSansCJKjp-hinted.zip && \
    mkdir -p /usr/share/fonts/noto && \
    cp *.otf /usr/share/fonts/noto && \
    chmod 644 -R /usr/share/fonts/noto/ && \
    fc-cache -fv && \
    rm -rf /noto

ADD requirements.txt /tmp/requirements.txt
RUN pip3 install -r /tmp/requirements.txt && rm /tmp/requirements.txt

RUN pip3 install --upgrade setuptools pip

ADD scripts/build.sh /tmp/build.sh
WORKDIR /tmp

ARG THEME

CMD ["/tmp/build.sh", $THEME]