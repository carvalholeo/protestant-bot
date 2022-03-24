require('./utils/dotEnv');
import app from './index';

const port = Number(process.env.PORT) ?? 3000;

app.listen(port);
