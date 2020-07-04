# Geekades Backend app

## Table of Contents

- [Getting Started](#getting-started)
- [Dockerization](#dockerization)
- [Configuration](#configuration)
- [Directory Structure](#directory-structure)

## Getting Started

Follow steps to execute this project.

1. Install dependencies

```bash
$ yarn install
```

2. Start a local server

```bash
$ yarn serve
```

3. Compile code

```bash
$ yarn build
```

4. Check code quality

```bash
$ yarn lint
```

## Dockerization

Dockerize an application.

1. Build and run the container in the background

```bash
$ docker-compose up -d app
```

2. Run a command in a running container

```bash
$ docker-compose exec app <COMMAND>
```

3. Remove the old container before creating the new one

```bash
$ docker-compose rm -fs
```

4. Restart up the container in the background

```bash
$ docker-compose up -d --build app
```

5. Push images to Docker Cloud

```diff
# .gitignore

  .DS_Store
  node_modules
  dist
  coverage
+ dev.Dockerfile
+ stage.Dockerfile
+ prod.Dockerfile
  *.log
```

```bash
$ docker login
$ docker build -f ./tools/<dev|stage|prod>.Dockerfile -t <IMAGE_NAME>:<IMAGE_TAG> .

# checkout
$ docker images

$ docker tag <IMAGE_NAME>:<IMAGE_TAG> <DOCKER_ID_USER>/<IMAGE_NAME>:<IMAGE_TAG>
$ docker push <DOCKER_ID_USER>/<IMAGE_NAME>:<IMAGE_TAG>

# remove
$ docker rmi <REPOSITORY>:<TAG>
# or
$ docker rmi <IMAGE_ID>
```

6. Pull images from Docker Cloud

```diff
# circle.yml

  echo "${HEROKU_TOKEN}" | docker login -u "${HEROKU_USERNAME}" --password-stdin registry.heroku.com
- docker build -f ./tools/$DEPLOYMENT_ENVIRONMENT.Dockerfile -t $APP_NAME .
+ docker pull <DOCKER_ID_USER>/<IMAGE_NAME>:<IMAGE_TAG>
- docker tag $APP_NAME registry.heroku.com/$APP_NAME/web
+ docker tag <IMAGE_NAME>:<IMAGE_TAG> registry.heroku.com/<HEROKU_PROJECT>/web
  docker push registry.heroku.com/<HEROKU_PROJECT>/web
```

## Configuration

### Default environments

Set your local environment variables.

```js
// src/env.js

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 3000;

export const SECRET = process.env.SECRET || 'PUT_YOUR_SECRET_HERE';

export const MONGODB_URI = process.env.MONGODB_URI || '<PUT_YOUR_MONGODB_URI_HERE>';
export const POSTGRES_URL = process.env.POSTGRES_URL || 'PUT_YOUR_POSTGRES_URL_HERE';

export const REDIS_PORT = process.env.REDIS_PORT || '<PUT_YOUR_REDIS_PORT_HERE>';
export const REDIS_HOST = process.env.REDIS_HOST || '<PUT_YOUR_REDIS_HOST_HERE>';

// ...
```

### Deployment environments

Set your deployment environment variables.

```dockerfile
# tools/<dev|stage|prod>.Dockerfile

# envs --
ENV SECRET <PUT_YOUR_SECRET_HERE>

ENV MONGODB_URI <PUT_YOUR_MONGODB_URI>
ENV POSTGRES_URL <PUT_YOUR_POSTGRES_URL_HERE>

ENV REDIS_PORT <PUT_YOUR_REDIS_PORT_HERE>
ENV REDIS_HOST <PUT_YOUR_REDIS_HOST_HERE>

# ...
# -- envs
```

## Directory Structure

The structure follows the LIFT Guidelines.

```coffee
.
├── src
│   ├── core -> core feature module
│   ├── <FEATURE> -> feature modules
│   │   ├── __tests__
│   │   │   ├── <FEATURE>.e2e-spec.js
│   │   │   └── <FEATURE>.spec.js
│   │   ├── _<THING> -> feature of private things
│   │   │   └── ...
│   │   └── <FEATURE>.js
│   ├── shared -> shared feature module
│   ├── app.js
│   ├── env.js
│   └── server.js
├── tools
│   └── ...
├── .editorconfig
├── .eslintrc
├── .gitignore
├── .prettierrc
├── babel.config
├── docker-compose.yml
├── Dockerfile
├── LICENSE
├── package.json
├── processes.js
├── README.md
└── yarn.lock
```
