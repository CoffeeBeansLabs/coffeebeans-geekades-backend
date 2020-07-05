import { indexOf } from 'lodash';

import { 
  data, getState, getRound, getImage, getStartTime, getEventTime, getLastImage, getResult
} from '../core/config';

const sockets = {};

const closeConnection = (io, email) => {
  const ns = io.of("/");
  const socket = ns.connected[email];
  if (socket) {
    socket.emit("closing");
    console.log("closing ->" + email);
    socket.leave("game");
  }
};

export const emitGameStartsInMessage = (client) => {
  client.emit("starts_in", {
    time: (new Date(data.config.START_TIME) - Date.now()) / 1000,
    type: "GAME"
  });
};

export const emitRoundStartsInMessage = (client) => {
  client.emit("starts_in", {
    time: (new Date(getStartTime()) - Date.now()) / 1000,
    type: "ROUND"
  });
};

export const emitNextHintMessage = (client, img, hintTime, last, count) => {
  client.emit("next_hint", {
    img,
    hint_time: (hintTime - Date.now()) / 1000,
    last,
    count,
  });
};

export const emitWinnerMessage = (client, RESULT) => {
  client.emit("result", {
    winners: {
      name: RESULT.name || "",
      url: RESULT.avatar || ""
    },
    answer: RESULT.answer,
    image: RESULT.image
  });
};

export const registerFunction = (client, pool) => {
  client.on("register", ({ token }) => {
    pool.query(
      "SELECT * FROM users WHERE token = $1",
      [token],
      (error, result) => {
        if (error || result.rowCount === 0) {
          client.leave("game");
        } else {
          const { email } = result.rows[0];
          console.log("register ->" + email);
          if (indexOf(sockets[email], client.id) < 0) {
            if (sockets[email]) {
              if (sockets[email].length < 3) {
                sockets[email].push(client.id);
              } else {
                closeConnection(sockets[email][0]);
                sockets[email] = sockets[email].slice(1);
                sockets[email].push(client.id);
              }
            } else {
              sockets[email] = [client.id];
            }
          }
          client.join("game");

          const currentState = getState();
          const currentRound = getRound();
          const currenImage = getImage();
          const eventTime = getEventTime();

          if (currentState === 0 && currentRound === -1) {
            emitGameStartsInMessage(client);
          } else if (currentState === 0 && currentRound >= 0) {
            emitRoundStartsInMessage(client);
          } else if (currentState === 1) {
            pool.query(
              "SELECT * FROM answers WHERE email=$1 and round=$2",
              [email, currentRound],
              (subError, subResult) => {
                let trialCount = "";
                if (subError) {
                  // returnError(res, 401, "database error code:SFL");
                  console.log('database error code:SFL')
                } else if (subResult.rowCount === 0) {
                  trialCount = 0;
                } else {
                  trialCount = subResult.rows[0].count;
                }
                emitNextHintMessage(
                  client,
                  data.rounds[currentRound].images[currenImage - 1],
                  eventTime,
                  currenImage === -1,
                  trialCount
                );
              }
            );
          } else if (currentState === 2) {
            pool.query(
              "SELECT * FROM answers WHERE email=$1 and round=$2",
              [email, currentRound],
              (subError, subResult) => {
                let trialCount = "";
                if (subError) {
                  // returnError(res, 401, "database error code:SFL");
                  console.log('database error code: SFL');
                } else if (subResult.rowCount === 0) {
                  trialCount = 0;
                } else {
                  trialCount = subResult.rows[0].count;
                }
                emitNextHintMessage(
                  client,
                  data.rounds[currentRound].images[
                    data.rounds[currentRound].images.length - 1
                  ],
                  eventTime,
                  getLastImage(),
                  trialCount
                );
            });
          } else if (currentState === 3) {
            emitWinnerMessage(client, getResult());
          }
        }
      }
    )
  });
};

export const unRegisterFunction = (client, pool) => {
  client.on("unregister", ({ token }) => {
    pool.query(
      "SELECT * FROM users WHERE token = $1",
      [token],
      (error, result) => {
        if (error || result.rowCount === 0) {
          client.leave("game");
        } else {
          const { email } = result.rows[0];
          console.log("unregister ->" + email);
          const index = sockets[email] && sockets[email].indexOf(client.id);
          if (index && index >= 0) {
            sockets[email] = sockets[email]
              .slice(0, index)
              .concat(sockets[email].slice(index + 1));
          }
          client.leave("game");
        }
      }
    );
  });
};