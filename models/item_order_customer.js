'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item_order_customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.item, {
        foreignKey: 'item_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      this.belongsTo(models.order_customer, {
        foreignKey: 'order_customer_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  item_order_customer.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      item_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'item',
          key: 'id',
        },
        allowNull: false,
      },
      order_customer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'order_customer',
          key: 'id',
        },
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
      modelName: 'item_order_customer',
    }
  );
  return item_order_customer;
};
