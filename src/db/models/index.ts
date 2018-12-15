'use strict';
import Sequelize from 'sequelize';
import { initAccountUser } from './AccountUser';
import { dbConfigOptions } from '../config';

const config = dbConfigOptions.development;
const sequelize = new Sequelize(config.url || process.env.DATABSE_URL, config);

const db = {
    sequelize,
    Sequelize,
    AccountUser: initAccountUser(sequelize)
};

Object.values(db).forEach((model: any) => {
    if (model.associate) {
      model.associate(db);
    }
  });

export default db;