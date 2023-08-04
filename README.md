0. 옵션 추가 API
   엔드포인트: POST '/options'
   요청 방법: POST
   요청 본문 예시: { "extraPrice": 500, "shotPrice": 300, "shotCount": 2, "hot": 1 }

1. 상품 추가 API
   엔드포인트: POST '/items'
   요청 방법: POST
   요청 본문 예시: { "name": "음료", "price": 2000, "type": "Drink"}

2. 상품 조회 API
   엔드포인트: GET '/items'
   요청 방법: GET
   쿼리 파라미터: 타입별로 상품을 조회. (예: GET /items?type=Drink)

3. 상품 삭제 API
   엔드포인트: DELETE '/items/:id' (상품의 고유한 id 값을 넣어야 함)
   요청 방법: DELETE

4. 상품 수정 API
   엔드포인트: PUT '/items/:id' (상품의 고유한 id 값을 넣어야 함)
   요청 방법: PUT
   요청 본문 예시 : { "name": "음료 수정", "price": 2500 }

5. 상품 발주 API
   엔드포인트: POST '/orderItems/:itemId' (상품의 고유한 id 값을 넣어야 함)
   요청 방법: POST
   요청 본문 예시: { "amount": 10 }

6. 발주 상태 수정 API
   엔드포인트: PUT '/orderItems/orderId/:id' (발주의 고유한 id 값을 넣어야 함)
   요청 방법: PUT
   요청 본문 예시: { "state": 1 }

7. 상품 주문 API
   엔드포인트: POST '/orderCustomers'
   요청 방법: POST
   요청 본문 예시: { "itemId": 1, "amount": 5, "optionId": 1 }

8. 상품 주문 수정 API
   엔드포인트: PUT '/orderCustomers/:id' (주문의 고유한 id 값을 넣어야 함)
   요청 방법: PUT
   요청 본문 예시: { "state": 1 }

9. 주문 상세 내용과 총 가격 조회 API
   엔드포인트: GET '/itemOrderCustomers/:orderCustomerId' (주문의 고유한 id 값을 넣어야 함)
   요청 방법: GET
