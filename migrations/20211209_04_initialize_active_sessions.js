const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('active_sessions', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('active_sessions')
  },
}