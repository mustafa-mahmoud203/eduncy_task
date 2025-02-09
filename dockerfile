FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx --yes prisma generate
CMD [ "npm","run","start" ]
EXPOSE 3000