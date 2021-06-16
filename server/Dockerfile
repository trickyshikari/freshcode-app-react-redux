FROM node:16.2.0

LABEL version="1.0"
LABEL description=""
LABEL maintainer = ["jarik.zp.tm@gmail.com"]

WORKDIR /server

COPY package*.json ./
COPY .env ./
RUN npm ci -qy

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
