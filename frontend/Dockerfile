FROM node:16-alpine as build
WORKDIR /build
COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM nginx:alpine as frontend

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist /frontend/build