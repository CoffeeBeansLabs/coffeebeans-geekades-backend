const fs = require("fs");

const path = process.cwd();
const buffer = fs.readFileSync(path + '/src/config.json');
const data = JSON.parse(buffer.toString());

let _STATE = data.config.STATE;

const setState = (state) => {
  _STATE = state;
};

const getState = () => {
  return _STATE;
};

let _IMAGE = data.config.IMAGE;

const setImage = (state) => {
  _IMAGE = state;
};

const getImage = () => {
  return _IMAGE;
};

let _ROUND = data.config.ROUND;

const setRound = (state) => {
  _ROUND = state;
};

const getRound = () => {
  return _ROUND;
};

let _EVENT_TIME = new Date(Date.now());

const setEventTime = (time) => {
  _EVENT_TIME = time;
};

const getEventTime = () => {
  return _EVENT_TIME;
};

let _START_TIME = data.config.START_TIME;

const setStartTime = (time) => {
  _START_TIME = time;
};

const getStartTime = () => {
  return _START_TIME;
};

let _LAST_IMAGE = false;

const setLastImage = (bool) => {
  _LAST_IMAGE = bool;
};

const getLastImage = () => {
  return _LAST_IMAGE;
};

let _RESULT = {};

const setResult = (result) => {
  _RESULT = {
    ..._RESULT,
    ...result,
  };
};

const getResult = () => {
  return _RESULT;
};

const GOOGLE_OAUTH2_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=';

let _onGoingTimer = null;

const getOnGoingTimer = () => {
  return _onGoingTimer;
}

const setOnGoingTimer = (timer) => {
  _onGoingTimer = timer;
}

export {
  GOOGLE_OAUTH2_URL,
  data,
  setState,
  getState,
  setImage,
  getImage,
  setRound,
  getRound,
  setStartTime,
  getStartTime,
  setEventTime,
  getEventTime,
  setLastImage,
  getLastImage,
  setResult,
  getResult,
  getOnGoingTimer,
  setOnGoingTimer
}