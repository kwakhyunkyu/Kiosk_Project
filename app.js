const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3001;

const itemsRouter = require('./routes/items');
const orderItemsRouter = require('./routes/orderItems');
const orderCustomersRouter = require('./routes/orderCustomers');
const itemOrderCustomersRouter = require('./routes/itemOrderCustomers');
const optionsRouter = require('./routes/options');

app.use(express.json());
app.use(cookieParser());

app.use('/items', itemsRouter);
app.use('/orderItems', orderItemsRouter);
app.use('/orderCustomers', orderCustomersRouter);
app.use('/itemOrderCustomers', itemOrderCustomersRouter);
app.use('/options', optionsRouter);

const { Option } = require('./models');
let cachedOptions = [];

const cacheOptions = async () => {
  try {
    cachedOptions = await Option.findAll();
    console.log('상품 옵션 정보가 메모리에 캐싱되었습니다.');
  } catch (error) {
    console.error('상품 옵션 정보를 캐싱하는 도중 오류가 발생했습니다.:', error);
  }
};

cacheOptions();

app.listen(PORT, () => {
  console.log(`${PORT} 포트 번호로 서버가 실행되었습니다.`);
});
