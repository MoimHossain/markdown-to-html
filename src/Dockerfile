

FROM node:carbon as HTLMS

WORKDIR /usr/src/app
COPY package.json package.json
COPY convert-markdown-to-html.js convert-markdown-to-html.js
COPY upload-to-blob-storage.js upload-to-blob-storage.js
RUN npm install markdown-it --save
RUN npm install azure-storage --save


# ADD  CloudCoreCapabilities.wiki ./wiki_raw/
# RUN node convert-markdown-to-html.js
# RUN node upload-to-blob-storage.js
