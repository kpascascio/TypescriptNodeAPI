'use strict';
import Sequelize from 'sequelize';
import { dbConfigOptions } from '../config';
import { initAccountUser } from './AccountUser';
import { initAccountUserSwipe } from './AccountUserSwipe';
import { initAccountUserLocation } from './AccountUserLocation';

const config = dbConfigOptions.development;
const sequelize = new Sequelize(config.url || process.env.DATABSE_URL, config);

const db = {
  sequelize,
  Sequelize,
  AccountUser: initAccountUser(sequelize),
  AccountUserSwipe: initAccountUserSwipe(sequelize),
  AccountUserLocation: initAccountUserLocation(sequelize)
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;