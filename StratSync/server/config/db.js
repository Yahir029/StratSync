// server/config/db.js
//const { Sequelize } = require('sequelize');
//require('dotenv').config();

//const sequelize = new Sequelize(process.env.DATABASE_URL, {
//  dialect: 'postgres',
 // dialectOptions: {
 //   ssl: {
 //     require: true,
 //     rejectUnauthorized: false,
 //   },
 // },
 // logging: false,
//});

//module.exports = sequelize;

// server/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export default sequelize;