const express = require('express');
const router = express.Router();
const { Item, Option } = require('../models');

// 상품 추가 API
router.post('/', async (req, res) => {
  try {
    const { name, price, type, optionId } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: `${name ? '가격' : '이름'}을 입력해주세요.` });
    }

    // 알맞은 타입이 아닐 경우
    const VALID_TYPES = ['Drink'];
    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: '알맞은 타입을 지정해주세요.' });
    }

    // 옵션 정보를 가져와서 존재하는지 확인
    const option = await Option.findByPk(optionId);
    if (!option) {
      return res.status(404).json({ error: '해당 옵션을 찾을 수 없습니다.' });
    }

    // 상품 추가
    const newItem = await Item.create({
      name,
      price,
      type: type || 'default',
      amount: 0,
      optionId,
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
    await item.destroy();

    res.json({ message: '상품이 삭제되었습니다.' });
  } catch (error) {
    console.error('상품을 삭제하는 도중 오류가 발생했습니다.:', error);
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
    await item.update({ name, price });

    res.json({ message: '상품 정보가 수정되었습니다.' });
  } catch (error) {
    console.error('상품을 수정하는 도중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
