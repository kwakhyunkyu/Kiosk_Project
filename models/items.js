'use strict';
const { Model } = require('sequelize');

// 추가하고 싶은 다른 타입을 추가해도 됩니다...!
const itemType = {
  COFFEE: 'coffee',
  JUICE: 'juice',
  FOOD: 'food',
};

module.exports = (sequelize, DataTypes) => {
  class items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // 아직은 비어있으나 필요한 경우 다른 모델들과의 관계를 정의할 수 있습니다.
    }
  }

  items.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      option_id: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
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
      modelName: 'items', // 모델 이름을 지정합니다.
    }
  );

  return items;
};
