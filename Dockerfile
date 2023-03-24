FROM node:14.18-alpine

ADD . /app
WORKDIR /app
## eliminar default y ponerle default al otro. mv
cd config 
rm default.json
mv default-docker.json default.json
cd ..
RUN npm i && npm run build
ENTRYPOINT ["npm", "run","production"]