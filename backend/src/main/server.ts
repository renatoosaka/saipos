import env from './config/env';
import { MySQLDB } from '../infra/database/mysql';

MySQLDB.connect({
  database: env.MYSQL_DB,
  host: env.MYSQL_HOST,
  password: env.MYSQL_PASS,
  user: env.MYSQL_USER,
  port: Number(env.MYSQL_PORT),
})
  .then(async () => {
    const app = (await import('./config/app')).default;

    app.listen(env.HTTP_PORT, () =>
      console.log(`http server running on port ${env.HTTP_PORT}`),
    );
  })
  .catch(console.error);
