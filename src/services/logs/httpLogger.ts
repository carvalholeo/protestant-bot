import path from 'path';
import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';

const accessLogStream = createStream('access.log', {
  interval: '1d',
  maxFiles: 366,
  maxSize: '5M',
  path: path.join(__dirname, '..', '..', 'logs', 'http'),
  teeToStdout: true,
})

const httpLogger = morgan('combined', {
  stream: accessLogStream,
});

export default httpLogger;
