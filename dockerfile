FROM node:alpine
COPY . /app
WORKDIR /app/server
CMD node index.js