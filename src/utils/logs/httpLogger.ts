import path from 'path';
import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import {Request, Response} from 'express'

const accessLogStream = createStream('access.log', {
  interval: '1d',
  maxFiles: 366,
  maxSize: '5M',
  path: path.join(__dirname, '..', '..', 'logs', 'http'),
  teeToStdout: true,
});

const httpLogger = morgan(function(tokens, req: Request, res: Response) {
  return [
    tokens['remote-addr'](req, res), '-',
    tokens['remote-user'](req, res), '-',
    `[${tokens.date(req, res, 'clf')}]`,
    `"${tokens.method(req, res)} ${tokens.url(req, res)} HTTP/${tokens['http-version'](req, res)}"`,
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens.referrer(req, res),
    `"${tokens['user-agent'](req, res)}"`, '-',
    `"${req.app.get('uniqueIdentifier')}"`
  ].join(' ');
}, {
  stream: accessLogStream,
});

export default httpLogger;
