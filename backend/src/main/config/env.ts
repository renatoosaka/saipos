export default {
  MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
  MYSQL_PORT: process.env.MYSQL_PORT || '3306',
  MYSQL_USER: process.env.MYSQL_USER || 'root',
  MYSQL_PASS: process.env.MYSQL_PASS || 'root',
  MYSQL_DB: process.env.MYSQL_DB || 'saipos_todo',
  HTTP_PORT: process.env.PORT ?? 5000,
};
