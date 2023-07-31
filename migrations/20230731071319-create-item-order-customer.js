'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('item_order_customer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'item',
          key: 'id',
        },
        allowNull: false,
      },
      order_customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'order_customer',
          key: 'id',
        },
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      option: {
        type: Sequelize.JSON,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('item_order_customer');
  },
};
