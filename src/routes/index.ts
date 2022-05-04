import { Router } from 'express';
import fullAppSanitizer from '../validators/fullAppSanitizer';

import blocklist from './blocklist';
import tweets from './tweets';
import users from './users';
import contact from './contact';

const routes = Router();

routes.use(fullAppSanitizer)

routes.get('/', (_req, res) =>
  res.status(200).json({ message: 'API it\'s working!' })
)

routes
  .use('/blocklist', blocklist)
  .use('/tweets', tweets)
  .use('/users', users)
  .use('/contact', contact);

export default routes;
