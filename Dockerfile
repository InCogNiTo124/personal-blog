FROM node:latest
COPY . /blog
WORKDIR /blog

RUN yarn install
RUN yarn build
EXPOSE 3000
CMD node build/index.js
