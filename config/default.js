module.exports = {
    // Configure database
  db: {
    dialect: 'postgres',
    username: 'test_db',
    password: 'test_db',
    database: 'test_db',
    host: '127.0.0.1',
    port: 5432,
    pool: {
      max: 60,
      min: 0,
    },
  },
}