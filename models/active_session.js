const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ActiveSession extends Model {}

ActiveSession.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'activeSession',
  timestamps: true
})

module.exports = ActiveSession