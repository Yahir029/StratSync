import { Sequelize } from 'sequelize';
import configFile from './config.js';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

let sequelize;

if (config.use_env_variable && process.env[config.use_env_variable]) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

export default sequelize;