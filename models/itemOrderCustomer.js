'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemOrderCustomer extends Model {
    static associate(models) {
      this.belongsTo(models.Item, {
        foreignKey: 'itemId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.belongsTo(models.OrderCustomer, {
        foreignKey: 'orderCustomerId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  ItemOrderCustomer.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderCustomerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
      },
      option: {
        type: DataTypes.JSON,
      },
      price: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ItemOrderCustomer',
      tableName: 'itemOrderCustomers',
    }
  );
  return ItemOrderCustomer;
};
