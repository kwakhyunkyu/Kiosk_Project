const express = require('express');
const router = express.Router();
const { Item, OrderItem, sequelize } = require('../models');

// 상품 발주 API
router.post('/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: '유효한 수량을 입력해주세요.' });
    }

    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: '해당 상품을 찾을 수 없습니다.' });
    }

    const newOrderItem = await OrderItem.create({
      itemId,
      amount,
      state: 0, // 발주의 기본 상태(default state)는 0으로 설정
    });

    res.status(201).json(newOrderItem);
  } catch (error) {
    console.error('발주 중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다..' });
  }
});

// 발주 상태 수정 API
router.put('/orderItems/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    console.log('id:', id); // id 값 확인
    console.log('state:', state); // state 값 확인

    const orderItem = await OrderItem.findByPk(id);
    console.log('orderItem:', orderItem); // orderItem 값 확인

    if (!orderItem) {
      return res.status(404).json({ error: '해당 발주 내역을 찾을 수 없습니다.' });
    }

    const { state: currentState } = orderItem;
    const item = await Item.findByPk(orderItem.itemId);
    console.log('item:', item); // item 값 확인

    // 주문 상태가 이미 'completed'인 경우에 대한 처리 추가
    if (state === 1 && currentState === 1) {
      return res.status(400).json({ error: '이미 주문 상태가 완료된 상태입니다.' });
    }

    if (state === 0 || state === 1) {
      if (currentState === 0 || currentState === 1) {
        const transaction = await sequelize.transaction();
        try {
          if (state === 1 && currentState === 0) {
            await orderItem.update({ state }, { transaction });
            await Item.increment('amount', { by: orderItem.amount, where: { id: orderItem.itemId }, transaction });
          } else if (state === 2) {
            if (!item || item.amount < orderItem.amount) {
              throw new Error('현재 수량이 발주 수량보다 적어 발주 취소가 불가능합니다.');
            }
            await orderItem.update({ state }, { transaction });
            await Item.decrement('amount', { by: orderItem.amount, where: { id: orderItem.itemId }, transaction });
          } else {
            await orderItem.update({ state }, { transaction });
          }
          await transaction.commit();
          res.status(200).json({ message: '발주 상태가 변경되었습니다.' });
        } catch (error) {
          await transaction.rollback();
          console.error('상태 수정 중 오류가 발생했습니다.:', error);
          res.status(500).json({ error: '서버 오류가 발생했습니다..' });
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
