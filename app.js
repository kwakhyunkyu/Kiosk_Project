const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3001;

const itemsRouter = require('./routes/items');
const orderItemsRouter = require('./routes/orderItems');
const orderCustomersRouter = require('./routes/orderCustomers');
const itemOrderCustomersRouter = require('./routes/itemOrderCustomers');

app.use(express.json());
app.use(cookieParser());

app.use('/items', itemsRouter);
app.use('/orderItems', orderItemsRouter);
app.use('/orderCustomers', orderCustomersRouter);
app.use('/itemOrderCustomers', itemOrderCustomersRouter);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
});
