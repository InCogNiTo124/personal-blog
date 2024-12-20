FROM node:22.2.0-alpine3.18 AS build-stage
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn build

FROM node:22.2.0-alpine3.18 as prod-stage
WORKDIR /build
COPY package.json yarn.lock ./
RUN yarn install --prod && yarn cache clean --all
COPY --from=build-stage /app/build/ ./build/
EXPOSE 3000
CMD node build/
