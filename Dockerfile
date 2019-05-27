FROM node:8

ENV NODE_ENV caas
ENV PORT 8080
ENV APP_DIR /data/app

COPY ./ /tmp
RUN cd /tmp \
    && npm install \
    && npm run release \
    && mkdir -p /data \
    && mv ./build/release/* /data \
    && rm -rf /tmp/* \
    && cd $APP_DIR \
    && npm install --only=prod --ignore-scripts

WORKDIR /data
CMD ["npm", "start"]
