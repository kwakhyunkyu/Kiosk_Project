const express = require('express');
const router = express.Router();
const { ItemOrderCustomer } = require('../models');

router.get('/:orderCustomerId', async (req, res) => {
  try {
    const { orderCustomerId } = req.params;
    const orderItems = await ItemOrderCustomer.findAll({
      where: { orderCustomerId },
    });
    res.status(200).json(orderItems);
  } catch (error) {
    console.error('주문 상세 아이템 조회 중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다..' });
  }
});

module.exports = router;
