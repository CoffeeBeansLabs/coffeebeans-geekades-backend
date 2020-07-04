export const NODE_ENV = process.env.NODE_ENV || 'development';

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 3000;

export const SECRET = process.env.SECRET || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu';

export const POSTGRES_URL = process.env.POSTGRES_URL || 'postgres://ymuxoegt:ONfBcCQylth3boOdUE2EkcZbC2OAbtcm@tantor.db.elephantsql.com:5432/ymuxoegt';

export const AUTH = {
  GOOGLE: {
    clientID: process.env.GOOGLE_ID || '584431831746-9b5743ro43sn7p6nfgbui0kqhj557kvt.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'stZ7p0BC_oQrUvJKsvqAxehT',
  }
};


export const RATE_LIMIT = process.env.RATE_LIMIT || 0;

export const STATIC_FILES = process.env.STATIC_FILES || null;
