

FROM node:carbon as HTLMS

WORKDIR /usr/src/app
COPY package.json package.json
COPY convert-markdown-to-html.js convert-markdown-to-html.js
COPY upload-to-blob-storage.js upload-to-blob-storage.js
RUN npm install markdown-it --save
RUN npm install azure-storage --save


ARG storageAcccount=notset
ARG storageKey=notset

ENV AZURE_STORAGE_ACCOUNT=$storageAcccount
ENV AZURE_STORAGE_KEY=$storageKey
