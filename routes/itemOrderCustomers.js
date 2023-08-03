const express = require('express');
const router = express.Router();
const { ItemOrderCustomer, Item } = require('../models');

// 주문 상세 내용과 총 가격 조회 API
router.get('/:orderCustomerId', async (req, res) => {
  try {
    const { orderCustomerId } = req.params;
    const orderItems = await ItemOrderCustomer.findAll({
      where: { orderCustomerId },
      attributes: ['id', 'itemId', 'orderCustomerId', 'amount', 'option', 'createdAt', 'updatedAt'],
      include: [{ model: Item, attributes: ['id', 'name', 'price'] }],
    });

    // 주문한 모든 상품 가격의 합을 계산
    const totalPrice = orderItems.reduce((acc, item) => acc + item.Item.price * item.amount, 0);

    res.status(200).json({ orderItems, totalPrice }); // 결과 반환
  } catch (error) {
    console.error('주문 상세 아이템 조회 중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
