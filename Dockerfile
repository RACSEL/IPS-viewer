FROM node:14.18-alpine

ADD . /app
WORKDIR /app
RUN npm i && npm run build
ENTRYPOINT ["npm", "run","production"]