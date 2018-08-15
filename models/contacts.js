'use strict';
var Sequelize = require('sequelize');

var contacts = global.sequelize.define('contacts', {
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
    type: Sequelize.STRING(32),
    field: 'email',
  },
  phoneNumber: {
    type: Sequelize.BIGINT,
    field: 'phoneNumber',
    allowNull: false
  }
}, {
  tableName: 'contacts',
  indexes: [
    {
      name: 'contactIdU',
      fields: ['id'],
      unique: true
    },
    {
      unique: true,
      fields: ['email']
    }
  ]
});

module.exports = contacts;
