// routes/orderItems.js
const express = require('express');
const router = express.Router();
const { Item, OrderItem } = require('../models');

// 주문 아이템 추가 API
router.post('/', async (req, res) => {
  try {
    const { itemId } = req.body;
    const newOrderItem = await OrderItem.create({
      itemId,
      state: 'ordered',
    });
    res.status(201).json(newOrderItem);
  } catch (error) {
    console.error('발주 중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다..' });
  }
});

// 주문 아이템 상태 수정 API
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
      return res.status(404).json({ error: '해당 발주 내역을 찾을 수 없습니다.' });
    }
    const { state: currentState } = orderItem;
    if (state === 'pending' || state === 'completed') {
      if (currentState === 'ordered' || currentState === 'pending') {
        if (state === 'completed' && currentState === 'pending') {
          const transaction = await sequelize.transaction();
          try {
            await orderItem.update({ state }, { transaction });
            await Item.increment('amount', { by: orderItem.amount, where: { id: orderItem.itemId }, transaction });
            await transaction.commit();
            res.status(200).json({ message: '발주 상태가 변경되었고, 상품의 수량이 증가되었습니다.' });
          } catch (error) {
            await transaction.rollback();
            console.error('상태 수정 중 오류가 발생했습니다.:', error);
            res.status(500).json({ error: '서버 오류가 발생했습니다..' });
          }
        } else if (state === 'canceled') {
          const transaction = await sequelize.transaction();
          try {
            const item = await Item.findByPk(orderItem.itemId);
            if (!item || item.amount < orderItem.amount) {
              throw new Error('현재 수량이 발주 수량보다 적어 발주 취소가 불가능합니다.');
            }
            await orderItem.update({ state }, { transaction });
            await Item.decrement('amount', { by: orderItem.amount, where: { id: orderItem.itemId }, transaction });
            await transaction.commit();
            res.status(200).json({ message: '발주 상태가 변경되었고, 상품의 수량이 감소되었습니다.' });
          } catch (error) {
            await transaction.rollback();
            console.error('상태 수정 중 오류가 발생했습니다.:', error);
            res.status(400).json({ error: error.message });
          }
        }
      } else {
        res.status(400).json({ error: '변경이 불가합니다.' });
      }
    } else {
      res.status(400).json({ error: '변경이 불가합니다.' });
    }
  } catch (error) {
    console.error('상태 수정 중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다..' });
  }
});

module.exports = router;
