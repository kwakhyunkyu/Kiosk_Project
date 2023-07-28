const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3001;

const itemsRouter = require('./routes/items');
const order_itemsRouter = require('./routes/order_items');

app.use(express.json());
app.use(cookieParser());

app.use('/items', itemsRouter);
app.use('/order_items', order_itemsRouter);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
});
