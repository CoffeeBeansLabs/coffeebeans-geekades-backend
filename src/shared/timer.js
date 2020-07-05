import { getRound, setOnGoingTimer } from '../core/config';
import { roundManager } from './roundManager';

export const startTimer = (client, pool, timeout) => {
  console.log(timeout, getRound());
  setOnGoingTimer(setTimeout(() => {
      const timeoutNew = roundManager(client, pool);
      startTimer(client, pool, timeoutNew);
    }, timeout)
  );
};

export const clearCustomTimer = (timer) => {
  clearTimeout(timer);
}