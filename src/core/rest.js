import { Router } from 'express';

import helloWorld from '../hello-world/rest';
import authentication from '../authentication/rest';
import submission from '../submission/rest';

const router = Router();

router.use('/authentication', authentication);
router.use('/api/v1/hello-world', helloWorld);
router.use('/api/v1/submission', submission);

export default router;
