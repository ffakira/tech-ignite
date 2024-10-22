FROM jarredsummer/bun:latest AS build

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

RUN bun run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.confg /etc/nginx/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]