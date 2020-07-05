import { Router } from 'express';

import helloWorld from '../hello-world/rest';
import authentication from '../authentication/rest';
import submission from '../submission/rest';
import startGame from '../start-game/rest';

const router = Router();

router.use('/v1/authentication', authentication);
router.use('/v1/hello-world', helloWorld);
router.use('/v1/submission', submission);
router.use('/v1/start-game', startGame);

export default router;
