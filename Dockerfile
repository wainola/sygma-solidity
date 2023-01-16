FROM trufflesuite/ganache

WORKDIR /app
COPY data/ /app/data
COPY .env /app/
RUN ls -al

CMD ["ganache"]
