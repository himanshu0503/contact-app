'use strict';
var Sequelize = require('sequelize');

var contactDetails = global.sequelize.define('contactDetails', {
  contactId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    field: 'contactId',
  },
  address: {
    type: Sequelize.STRING(255),
    field: 'address',
    allowNull: true
  },
  skypeId: {
    type: Sequelize.STRING(24),
    field: 'skypeId',
  },
  phoneNumbers: {
    type: Sequelize.TEXT,
    field: 'phoneNumbers',
    allowNull: true
  }
}, {
  tableName: 'contactDetails',
  indexes: [
    {
      name: 'contactDetailIdU',
      fields: ['contactId'],
      unique: true
    }
  ]
});

module.exports = contactDetails;
