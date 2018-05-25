# Introduction

A docker image that converts a VSTS wiki repository into a html site and stores the htmls into a Blob Storage during the image build.


# Why?

Totally because I just wanted to write it that way. There is no other rational behind. 


# How to use?

Create your own docker image based on this image.

``` javascript

FROM moimhossain/markdown-to-html

WORKDIR /usr/src/app


ARG storageAcccount=notset
ARG storageKey=notset

ENV AZURE_STORAGE_ACCOUNT=$storageAcccount
ENV AZURE_STORAGE_ACCESS_KEY=$storageKey


ADD  CloudCoreCapabilities.wiki ./wiki_raw/
RUN node convert-markdown-to-html.js
RUN node upload-to-blob-storage.js

ADD  markdownfolder ./wiki_raw/
RUN node convert-markdown-to-html.js
RUN node upload-to-blob-storage.js

```

Once you have this `Dockerfile`, run it as following:

``` javascript

docker build -t whatever --build-arg storageAcccount=AZURE_STORAGE_NAME --build-arg storageKey=AZURE_STORAGE_KEY

``` 

That's it. Thanks for looking into. :-)