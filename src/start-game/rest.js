import { Router } from 'express';

import {
  data, setState, setRound, setImage, setStartTime, setLastImage, getOnGoingTimer
} from '../core/config';
import { startTimer, clearCustomTimer } from '../shared/timer';
import { emitGameStartsInMessage } from '../messages/real-time';

const router = Router();

router.get('/', async(req, res) => {
  const io = req.app.get('socket');
  const client = io.to('game');
  
  const pool = req.app.get('poolClient');

  if (
    data.config.DEBUG &&
    req.query.token === "gasdggueguvgvvbkjoieiipohjihshdggdjhgfjagfjgjagfgjhagjgsagjfgajwuiheirhfeero"
  ) {
    setState(Number(req.query.state || "0"));
    setImage(Number(req.query.image || "0"));
    setRound(Number(req.query.round || "-1"));
    setLastImage(false);
    clearCustomTimer(getOnGoingTimer());

    const START_TIME = new Date(Date.now());
    START_TIME.setSeconds(
      START_TIME.getSeconds() + Number(req.query.timer || "0")
    );
    setStartTime(START_TIME);

    emitGameStartsInMessage(
      client,
      Number(req.query.timer) || 0,
      "ROUND"
    );

    startTimer(client, pool, Number(req.query.timer) * 1000);
    res.send(`<marque>Started </marque>`);
  } else {
    res.send("");
  }
});

export default router;
