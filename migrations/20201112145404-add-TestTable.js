'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('TestTables', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      allowNull: false,
    },
    class: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: async (queryInterface) => {
    await queryInterface.dropTable('TestTables');
  }
};
