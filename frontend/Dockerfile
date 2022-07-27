FROM node:16-alpine as build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine as frontend
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/build /frontend/build