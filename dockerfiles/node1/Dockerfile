FROM node:16

RUN npm i -g ganache@7.5.0

WORKDIR /app
COPY data/ /app/data

CMD ["ganache"]