import { Router } from 'express';
import logger from '../utils/logs/logger';
import fullAppSanitizer from '../validators/fullAppSanitizer';

import blocklist from './blocklist';
import tweets from './tweets';
import users from './users';
import contact from './contact';

const routes = Router();

routes.use(fullAppSanitizer);

routes.get('/', (req, res) => {
  const message = "API it's working!";
  res.status(200).json({ message });

  logger.verbose(`${message}. ID: ${req.app.get('uniqueIdentifier')}`);
});

routes
  .use('/blocklist', blocklist)
  .use('/tweets', tweets)
  .use('/users', users)
  .use('/contact', contact);

export default routes;
