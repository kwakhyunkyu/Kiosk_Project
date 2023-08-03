const express = require('express');
const router = express.Router();
const { Option } = require('../models');

// 옵션 추가 API
router.post('/', async (req, res) => {
  try {
    const { extraPrice, shotPrice, hot } = req.body;

    // extra 사이즈 선택 시 추가 요금은 0 이상이어야 함
    if (extraPrice < 0) {
      return res.status(400).json({ error: 'extra 사이즈 선택 시 추가 요금은 0 이상이어야 합니다.' });
    }

    // shot 추가 선택 시 추가 요금은 0 이상이어야 함
    if (shotPrice < 0) {
      return res.status(400).json({ error: 'shot 추가 선택 시 추가 요금은 0 이상이어야 합니다.' });
    }

    const option = await Option.create({
      extraPrice,
      shotPrice,
      hot,
    });

    res.status(201).json(option);
  } catch (error) {
    console.error('옵션을 추가하는 도중 오류가 발생했습니다.:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
