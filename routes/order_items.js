const express = require('express');
const router = express.Router();
const { Item } = require('../models');
const { OrderItem } = require('../models');
const sequelize = require('sequelize');

// 상품 발주 API
router.post('/', async (req, res) => {
  try {
    const { item_id } = req.body;

    // 상품 발주 내역 추가
    const newOrderItem = await OrderItem.create({
      item_id,
      state: 'ordered',
    });

    res.status(201).json(newOrderItem);
  } catch (error) {
    console.error('발주 중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다..' });
  }
});

// 상품 발주 수정 API
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    // 해당 ID로 발주 내역을 조회
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
      return res.status(404).json({ error: '해당 발주 내역을 찾을 수 없습니다.' });
    }

    // 현재 발주 내역의 상태 변경이 가능한지 여부 확인!
    const { state: currentState } = orderItem;
    if (state === 'pending' || state === 'completed') {
      if (currentState === 'ordered' || currentState === 'pending') {
        // 상태 변경이 가능한 경우
        if (state === 'completed' && currentState === 'pending') {
          const transaction = await sequelize.transaction();
          try {
            // 상태를 수정하고 상품의 amount를 증가시킴
            await orderItem.update({ state }, { transaction });
            await Item.increment('amount', { by: orderItem.amount, where: { id: orderItem.item_id }, transaction });

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
            // 수량 확인(주문한 수량보다 현재 수량이 적은지 알아보기 위해서)
            const item = await Item.findByPk(orderItem.item_id);
            if (!item || item.amount < orderItem.amount) {
              throw new Error('현재 수량이 발주 수량보다 적어 발주 취소가 불가능합니다.');
            }

            // 상품의 수량을 감소시킴
            await orderItem.update({ state }, { transaction });
            await Item.decrement('amount', { by: orderItem.amount, where: { id: orderItem.item_id }, transaction });

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
