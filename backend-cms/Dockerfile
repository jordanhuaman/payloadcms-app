FROM node:22-alpine

WORKDIR /app

RUN corepack enable pnpm

COPY package.json ./
RUN corepack enable pnpm && pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]