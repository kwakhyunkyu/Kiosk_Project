const express = require('express');
const router = express.Router();
const { Item } = require('../models');

// 상수로 타입 목록 분리
const VALID_TYPES = ['Drink'];

// 상품 추가 API
router.post('/', async (req, res) => {
  try {
    const { name, price, type } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: `${name ? '가격' : '이름'}을 입력해주세요.` });
    }

    // 알맞은 타입이 아닐 경우
    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: '알맞은 타입을 지정해주세요.' });
    }

    // 상품 추가
    const newItem = await Item.create({
      name,
      price,
      type: type || 'default',
      amount: 0,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('상품을 추가하는 도중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 상품 조회 API
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let items;

    if (type) {
      // 타입별로 상품 조회
      items = await Item.findAll({
        where: { type: type },
      });
    } else {
      // 전체 상품 조회
      items = await Item.findAll();
    }

    res.json(items);
  } catch (error) {
    console.error('상품을 조회하는 도중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 상품 삭제 API
router.delete('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    // 상품 삭제
    await Item.destroy({ where: { id: itemId } });

    res.json({ message: '상품이 삭제되었습니다.' });
  } catch (error) {
    console.error('상품을 삭제하는 도중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 1차 - 사용자의 대답에 따라 삭제 또는 유지
router.post('/:id/delete', async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    const answer = req.body.answer;

    if (answer === '예') {
      // 2차 - 사용자의 대답이 '예'인 경우 상품 삭제
      await Item.deleteItem(itemId);
      return res.json({ message: '상품이 삭제되었습니다.' });
    } else {
      // 2차 - 사용자의 대답이 반대인 경우 상품 유지
      return res.json({ message: '상품이 유지되었습니다.' });
    }
  } catch (error) {
    console.error('삭제 요청을 처리하는 도중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 상품 수정 API
router.put('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findByPk(itemId);

    if (!item) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    const { name, price } = req.body;

    if (!name.trim()) {
      return res.status(400).json({ error: '이름을 입력해주세요.' });
    }

    if (price < 0) {
      return res.status(400).json({ error: '알맞은 가격을 입력해주세요.' });
    }

    // 상품명과 가격 수정
    const message = await Item.updateItem(itemId, name, price);

    res.json({ message });
  } catch (error) {
    console.error('상품을 수정하는 도중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
