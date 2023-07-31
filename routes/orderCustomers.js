const express = require('express');
const router = express.Router();
const { OrderCustomer, ItemOrderCustomer } = require('../models');
const sequelize = require('sequelize');

router.post('/', async (req, res) => {
  try {
    const { itemId, amount } = req.body;
    const newOrderCustomer = await OrderCustomer.create({
      state: false,
    });
    const newOrderItem = await ItemOrderCustomer.create({
      orderCustomerId: newOrderCustomer.id,
      itemId,
      amount,
    });
    const orderItems = await ItemOrderCustomer.findAll({
      where: {
        orderCustomerId: newOrderCustomer.id,
      },
    });
    const totalPrice = orderItems.reduce((acc, item) => acc + item.price, 0);
    res.status(201).json({ newOrderItem, totalPrice });
  } catch (error) {
    console.error('발주 중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다..' });
  }
});

module.exports = router;
