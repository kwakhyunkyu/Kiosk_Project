const express = require('express');
const router = express.Router();
const { OrderCustomer, ItemOrderCustomer, sequelize, Item, Option } = require('../models');

// 상품 주문 생성 API
router.post('/', async (req, res) => {
  try {
    const { itemId, amount, optionId } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: '유효한 수량을 입력해주세요.' });
    }

    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: '해당 상품을 찾을 수 없습니다.' });
    }

    const selectedOption = await Option.findByPk(optionId);

    if (!selectedOption) {
      return res.status(400).json({ error: '올바른 옵션을 선택해주세요.' });
    }

    // 옵션 추가 가격 계산
    let optionPrice = 0;
    if (selectedOption.extraPrice > 0) {
      optionPrice += selectedOption.extraPrice;
    }

    // hot일 경우 옵션 추가 가격이 발생하지 않도록 처리
    if (selectedOption.hot && item.hotPrice) {
      optionPrice = 0;
    }

    // 주문 생성
    const newOrderCustomer = await OrderCustomer.create({
      state: false,
    });

    // 상품별 주문 상세 정보 생성
    const newOrderItem = await ItemOrderCustomer.create({
      orderCustomerId: newOrderCustomer.id,
      itemId,
      amount,
      option: JSON.stringify(selectedOption), // 옵션 정보를 저장
      price: (item.price + optionPrice) * amount, // 가격 정보를 저장
    });

    // 옵션 상세 정보를 응답에 포함시킴
    res.status(201).json({ newOrderItem, option: selectedOption });
  } catch (error) {
    console.error('주문 중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 상품 주문 수정 API
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const orderCustomer = await OrderCustomer.findByPk(id);

    if (!orderCustomer) {
      return res.status(404).json({ error: '해당 주문을 찾을 수 없습니다.' });
    }

    const { state: currentState } = orderCustomer;

    if (currentState === 1) {
      return res.status(400).json({ error: '완료된 주문은 취소할 수 없습니다.' });
    }

    if (state === 1) {
      const transaction = await sequelize.transaction();
      try {
        await orderCustomer.update({ state }, { transaction });

        // 주문 완료 시 해당 아이템들의 수량(amount)을 감소
        const orderItems = await ItemOrderCustomer.findAll({
          where: {
            orderCustomerId: id,
          },
        });
        for (const orderItem of orderItems) {
          await Item.decrement('amount', {
            by: orderItem.amount,
            where: { id: orderItem.itemId },
            transaction,
          });
        }

        await transaction.commit();
        res.status(200).json({ message: '주문이 완료되었습니다.' });
      } catch (error) {
        await transaction.rollback();
        console.error('주문 완료 중 오류가 발생했습니다.:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      }
    } else {
      // 주문 취소 시 orderCustomer 데이터와 itemOrderCustomer 데이터를 일괄 삭제
      if (currentState === 0) {
        const transaction = await sequelize.transaction();
        try {
          await orderCustomer.destroy({ transaction });
          await ItemOrderCustomer.destroy({
            where: {
              orderCustomerId: id,
            },
            transaction,
          });

          await transaction.commit();
          res.status(200).json({ message: '주문이 취소되었습니다.' });
        } catch (error) {
          await transaction.rollback();
          console.error('주문 취소 중 오류가 발생했습니다.:', error);
          res.status(500).json({ error: '서버 오류가 발생했습니다.' });
        }
      } else {
        res.status(400).json({ error: '변경이 불가합니다.' });
      }
    }
  } catch (error) {
    console.error('주문 상태 수정 중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
