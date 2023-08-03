const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      this.hasMany(models.OrderItem, {
        foreignKey: 'itemId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.ItemOrderCustomer, {
        foreignKey: 'itemId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.belongsTo(models.Option, {
        foreignKey: 'optionId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }

    static async addItem(name, price, type, optionId) {
      try {
        // 상품 추가
        const newItem = await Item.create({
          name,
          price,
          type: type || 'default',
          amount: 0,
          optionId,
        });

        return newItem;
      } catch (error) {
        throw new Error(`상품을 추가하는 도중 오류가 발생했습니다.: ${error.message}`);
      }
    }

    static async updateItem(itemId, name, price) {
      try {
        const item = await Item.findByPk(itemId);

        if (!item) {
          throw new Error('상품을 찾을 수 없습니다.');
        }

        // 상품명과 가격 수정
        await item.update({ name, price });

        return '상품 정보가 수정되었습니다.';
      } catch (error) {
        throw new Error(`상품을 수정하는 도중 오류가 발생했습니다.: ${error.message}`);
      }
    }

    static async deleteItem(itemId) {
      try {
        const item = await Item.findByPk(itemId);

        if (!item) {
          throw new Error('상품을 찾을 수 없습니다.');
        }

        // 상품 삭제
        await item.destroy();

        return '상품이 삭제되었습니다.';
      } catch (error) {
        throw new Error(`상품을 삭제하는 도중 오류가 발생했습니다.: ${error.message}`);
      }
    }
  }

  Item.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      optionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      modelName: 'Item',
      tableName: 'items',
    }
  );

  return Item;
};
