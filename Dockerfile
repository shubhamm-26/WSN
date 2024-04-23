FROM node:21.7.1

WORKDIR /WSN

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]