// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'marketcapsule',
      port: 3306
    },
    pool: {
      min: 5,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT || 3306,
      ssl: process.env.DATABASE_SSL === 'true' ? {
        key: process.env.DATABASE_SSL_KEY,
        cert: process.env.DATABASE_SSL_CERT,
        ca: process.env.DATABASE_SSL_CA,
        capath: process.env.DATABASE_SSL_CAPATH,
        cipher: process.env.DATABASE_SSL_CIPHER,
        rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true'
      } : false
    },
    pool: {
      min: 5,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};