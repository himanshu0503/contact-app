'use strict';
var Sequelize = require('sequelize');

var users = global.sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(24),
    field: 'name',
    allowNull: true
  },
  email: {
    type: Sequelize.STRING(24),
    field: 'email',
    allowNull: true
  },
  password: {
    type: Sequelize.STRING(64),
    field: 'password',
    allowNull: true
  },
  phoneNumber: {
    type: Sequelize.BIGINT,
    field: 'phoneNumber',
    allowNull: false
  },
  authToken: {
    type: Sequelize.STRING(24),
    field: 'authToken',
    allowNull: false
  }
}, {
  tableName: 'users',
  indexes: [
    {
      name: 'userIdU',
      fields: ['id'],
      unique: true
    },
    {
      unique: true,
      fields: ['phoneNumber']
    },
    {
      unique: true,
      fields: ['authToken']
    }
  ]
});

module.exports = users;
