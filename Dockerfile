FROM node:alpine

WORKDIR /app

# Copy all project files, including assets
COPY . .

RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]

