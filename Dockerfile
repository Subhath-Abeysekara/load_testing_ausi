FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN tsc
EXPOSE 3000
CMD ["ts-node", "app.ts"]
