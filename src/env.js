export const NODE_ENV = process.env.NODE_ENV || 'development';

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 3000;

export const SECRET = process.env.SECRET || 'jbmpHPLoaV8N0nEpuLxlpT95FYakMPiu';

export const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME || 'geekades';
export const POSTGRES_HOST = process.env.POSTGRES_HOST || '10.0.0.236';
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'quize';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'geekades';
export const POSTGRES_PORT = process.env.POSTGRES_PORT || '5432';

export const AUTH = {
  GOOGLE: {
    clientID: process.env.GOOGLE_ID || '674308453172-k72a2a8pa39u7330n765cgp0vq2596s0.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'VxUI3MHWdcrPhBSXEeIMTuSu',
    redirectURL: process.env.GOOGLE_SECRET || 'http://locahost:4200/home'
  }
};


export const RATE_LIMIT = process.env.RATE_LIMIT || 0;

export const STATIC_FILES = process.env.STATIC_FILES || null;
