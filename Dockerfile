FROM node:16

RUN npm i -g ganache

WORKDIR /app
COPY data/ /app/data

CMD ["ganache"]