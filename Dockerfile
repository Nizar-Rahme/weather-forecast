FROM node:14.16.0 AS development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:14.16.0 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

COPY --from=development /usr/src/app/dist ./dist

HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/main"]