import { data, getState, getRound, getImage, getLastImage, setImage, setRound, setLastImage, setEventTime, setResult, setState } from '../core/config';
import { emitWinnerMessage, emitNextHintMessage } from '../messages/real-time';

/*
0 -> game doesn't start/ round dosent start
1 -> inside a round
2 -> end of one round
3 -> stop game
4 -> in result
*/

export const roundManager = (client, pool) => {  
  let timeout = 0;

  if (getState() === 0) {
    setImage(1);
    if (getRound() === -1) setRound(0);
    setImage(0);
    timeout = 1;
  } else if (getRound() >= 0 && getImage() >= 0 && getState() === 1) {
    // inside one round
    emitNextHintMessage(client, 
      data.rounds[getRound()].images[getImage()],
      data.rounds[getRound()].round_time / data.rounds[getRound()].images.length,
      getLastImage()
    );
    if (getImage() < data.rounds[getRound()].images.length - 1) {
      setImage(getImage() + 1);
      setLastImage(getImage() === data.rounds[getRound()].images.length - 1);
      timeout =
        data.rounds[getRound()].round_time / data.rounds[getRound()].images.length;
    } else {
      setImage(-1);
      setState(2); // end one round
      timeout =
        data.rounds[getRound()].round_time / data.rounds[getRound()].images.length;
    }
    const eventTime = new Date(Date.now());
    eventTime.setSeconds(eventTime.getSeconds() + timeout);
    setEventTime(eventTime);
  } else if (getImage() === -1 && getState() === 2) {
    // show result

    if (getRound() < data.rounds.length - 1) {
      setRound(getRound() + 1);

      setImage(0);
      setState(4); // in result
      timeout = data.config.result_time;
      const eventTime = new Date(Date.now());
      eventTime.setSeconds(
        eventTime.getSeconds() + timeout + data.config.round_intervel
      );
      setEventTime(eventTime);
    } else {
      setState(3); // stop game
    }
    pool.query(
      "select users.name, users.avatar from users inner join answers on users.email = answers.email where answers.count> 0 and answers.round = $1 and answers.answer = $2 order by answers.time limit 1;",
      [
        getRound() - 1,
        data.rounds[getRound() - 1].answer
          .trim()
          .toLowerCase()
          .replace(/ /g, "")
      ],
      (error, result) => {
        if (error) {
          console.log("database error code:RC");
        } else {
          const RESULT = result.rows[0] || {};
          RESULT.answer = data.rounds[getRound() - 1].answer;
          RESULT.image = data.rounds[getRound() - 1].image;
          setResult(RESULT);
          emitWinnerMessage(
            client,
            {
              name: (result.rows[0] && result.rows[0].name) || "",
              url: (result.rows[0] && result.rows[0].avatar) || ""
            },
            data.rounds[getRound() - 1].answer,
            data.rounds[getRound() - 1].image
          );
        }
      }
    );
  } else if (getState() === 3) {
    timeout = 2147483;
  } else if (getState() === 4) {
    timeout = 0;
    setState(3);
  }
  return timeout * 1000;
};