import dotenv from 'dotenv';
dotenv.config();

export const dbConfigOptions = {
    'development': {
        'url': process.env.LOCALDBURI,
        'dialect': 'postgres'
      },
      'test': {
        'username': 'root',
        'password': 'undefined',
        'database': 'database_test',
        'host': '127.0.0.1',
        'dialect': 'postgres'
      },
      'production': {
        'username': 'root',
        'password': 'null',
        'database': 'database_production',
        'host': '127.0.0.1',
        'dialect': 'postgres'
      }
};