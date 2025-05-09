FROM node:20

WORKDIR /app

COPY package.json vite.config.js /app/
COPY .env /app/.env
RUN npm install

COPY ./src /app/src
COPY ./public /app/public

ENV PORT 5173
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
