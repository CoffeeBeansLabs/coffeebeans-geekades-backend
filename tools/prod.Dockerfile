FROM node:13

ENV HOME /geekades-backend

WORKDIR ${HOME}
ADD . $HOME

RUN yarn install && yarn build

ENV NODE_ENV production

# envs --
ENV HOST 0.0.0.0

ENV SECRET jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu

ENV POSTGRES_URL postgres://ymuxoegt:ONfBcCQylth3boOdUE2EkcZbC2OAbtcm@tantor.db.elephantsql.com:5432/ymuxoegt

ENV RATE_LIMIT 100
# -- envs

# processes --
ENV WEB_CONCURRENCY 1
# -- processes

CMD node processes.js
