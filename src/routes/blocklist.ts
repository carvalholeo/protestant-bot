import { Router } from 'express';

import BlocklistController from '../controllers/BlocklistController';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import userToBlockValidator from '../validators/publicApi/userToBlockValidator';
import userToUnblockValidator from '../validators/publicApi/userToUnblockValidator';

const blocklist = Router();

blocklist
  .post(
    '/block',
    userToBlockValidator,
    validatorMiddleware,
    BlocklistController.block
  )
  .put(
    '/unblock',
    userToUnblockValidator,
    validatorMiddleware,
    BlocklistController.unblock
  );

export default blocklist;
