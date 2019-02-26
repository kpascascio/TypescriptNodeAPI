'use strict';
import dotenv from 'dotenv';
dotenv.config();
import Sequelize from 'sequelize';
import { dbConfigOptions } from '../config';
import { initAccountUser } from './AccountUser';
import { initAccountUserSwipe } from './AccountUserSwipe';
import { initAccountUserLocation } from './AccountUserLocation';
import { initAccountUserFacebook } from './AccountUserFacebook';

const config = dbConfigOptions.development;
const sequelize = new Sequelize(process.env.DATABASE_URL || config.url, config);

const db = {
  'sequelize': sequelize,
  'Sequelize': Sequelize,
  'AccountUser': initAccountUser(sequelize),
  'AccountUserSwipe': initAccountUserSwipe(sequelize),
  'AccountUserLocation': initAccountUserLocation(sequelize),
  'AccountUserFacebook': initAccountUserFacebook(sequelize)
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;