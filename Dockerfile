FROM node:20.11-alpine3.19 AS build

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
RUN npm ci
RUN npm run build

FROM node:20.11-alpine3.19
WORKDIR /server
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/build ./build
RUN npm ci --omit=dev

ENTRYPOINT ["npm", "run", "start"]
