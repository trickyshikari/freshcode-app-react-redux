FROM node:16.2.0

LABEL version="1.0"
LABEL description="Front-end part of Issue Tracker App"
LABEL maintainer = ["yanstoyanov2012@gmail.com"]

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci -qy

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
