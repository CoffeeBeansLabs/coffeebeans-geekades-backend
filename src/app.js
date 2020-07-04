import { join } from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import session from 'express-session';
import history from 'express-history-api-fallback';

import routes from '~/core/rest';
import passport from '~/core/passport';
import redis from '~/core/redis';

import { SECRET, RATE_LIMIT, STATIC_FILES } from './env';

const app = express();

/**
 * @name middleware-functions
 */
app.use(helmet());
app.use(cors());
app.use(rateLimit({ max: Number(RATE_LIMIT), windowMs: 15 * 60 * 1000 }));
app.use(compression());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  store: new (connectRedis(session))({ client: redis }),
  name: 'sid',
  resave: true,
  saveUninitialized: true,
  secret: SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * @name REST
 */
app.use('/', routes);

/**
 * @name static-files
 */
if (STATIC_FILES) {
  const root = join(__dirname, `../${STATIC_FILES}`);

  // serve static
  app.use(express.static(root));

  // spa friendly
  app.use(history('index.html', { root }));
}

export default app;
