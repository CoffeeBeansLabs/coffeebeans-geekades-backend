FROM node:13

ENV HOME /geekades-backend

WORKDIR ${HOME}
ADD . $HOME

RUN yarn install --frozen-lockfile

EXPOSE 3000
