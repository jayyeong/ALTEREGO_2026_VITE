import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// 환경 변수에서 API URL 가져오기
const API_URL = process.env.REACT_APP_API_URL || '';

const OrderCompletePage = () => {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceiptDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/store/receipts/${receiptId}`);
        setReceipt(response.data);
        setLoading(false);
      } catch (err) {
        console.error('주문 정보를 불러오는 중 오류가 발생했습니다:', err);
        setError('주문 정보를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchReceiptDetails();
  }, [receiptId]);

  // 이미지 경로 처리 함수
  const getImageSrc = (imagePath) => {
    try {
      if (imagePath && imagePath.startsWith('assets/')) {
        return require(`../${imagePath}`);
      }
      return imagePath || 'https://via.placeholder.com/80x80?text=No+Image';
    } catch (error) {
      console.error('Error loading image:', error);
      return 'https://via.placeholder.com/80x80?text=Error+Loading+Image';
    }
  };

  if (loading) return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      <div className="mx-auto py-4 md:py-8 px-4 w-full max-w-7xl">
        <p className="text-center text-black">로딩 중...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      <div className="mx-auto py-4 md:py-8 px-4 w-full max-w-7xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
          {error}
        </div>
        <div className="text-center">
          <Link
            to="/store/all"
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );

  if (!receipt) return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      <div className="mx-auto py-4 md:py-8 px-4 w-full max-w-7xl">
        <p className="text-center text-black text-lg">주문 정보를 찾을 수 없습니다.</p>
        <div className="text-center mt-6">
          <Link
            to="/store/all"
            className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition-colors"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb border-t border-b border-gray-300 py-2 px-4">
        <div className="mx-auto w-full max-w-7xl px-4">
          <nav className="text-sm text-black">
            <Link to="/store" className="hover:underline">STORE</Link>
            {' > '}
            <span>주문 완료</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto py-4 md:py-8 px-4 w-full max-w-7xl">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">주문이 완료되었습니다</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-1 md:mb-2">주문번호: {receipt.id}</p>
          <p className="text-sm md:text-base text-gray-600">입금 확인 후 문자로 알려드리겠습니다.</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6 mb-4 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">주문 정보</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
            <div>
              <p className="text-sm md:text-base"><span className="font-medium">입금자명:</span> {receipt.accountHolder}</p>
              <p className="text-sm md:text-base"><span className="font-medium">연락처:</span> {receipt.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm md:text-base"><span className="font-medium">주문일시:</span> {new Date(receipt.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mb-4 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">입금 계좌 정보</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              <div className="mb-2 md:mb-0">
                <p className="font-medium text-sm md:text-base">은행명</p>
                <p className="text-gray-700 text-sm md:text-base">IBK기업은행</p>
              </div>
              <div className="mb-2 md:mb-0">
                <p className="font-medium text-sm md:text-base">계좌번호</p>
                <p className="text-gray-700 text-sm md:text-base">11116875301018</p>
              </div>
              <div>
                <p className="font-medium text-sm md:text-base">예금주</p>
                <p className="text-gray-700 text-sm md:text-base">박상현</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 md:mb-10">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">주문 상품 정보</h2>
          <div className="border-t border-b border-gray-200">
            {receipt.orders && receipt.orders.map((order) => (
              <div key={order.id} className="flex flex-col md:flex-row py-3 md:py-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center mb-2 md:mb-0">
                  <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] mr-3 md:mr-4 overflow-hidden">
                    <img
                      src={order.itemImagePath ? getImageSrc(order.itemImagePath) : 'https://via.placeholder.com/80x80?text=No+Image'}
                      alt={order.itemName || '상품 이미지'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80x80?text=Error';
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm md:text-base">{order.itemName || '상품명 없음'}</h3>
                    <p className="text-xs md:text-sm text-gray-600">{order.creator || ''}</p>
                  </div>
                </div>
                <div className="flex justify-between md:flex-col md:items-end md:ml-auto">
                  <p className="text-xs md:text-sm text-gray-700">
                    {Number(order.price).toLocaleString()} ₩ × {order.quantity}
                  </p>
                  <p className="font-medium text-sm md:text-base">{Number(order.totalPrice).toLocaleString()} ₩</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 md:pt-6 mb-6 md:mb-10">
          <div className="flex justify-between">
            <span className="text-lg md:text-xl font-semibold">총 주문금액</span>
            <span className="text-lg md:text-xl font-bold">{Number(receipt.totalAmount).toLocaleString()} ₩</span>
          </div>
        </div>

        <div className="text-center mb-6 md:mb-8">
          <Link
            to="/store/all"
            className="bg-indigo-600 text-white py-2 md:py-3 px-6 md:px-8 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
          >
            쇼핑 계속하기
          </Link>
        </div>

        <div className="text-gray-600 text-center text-xs md:text-sm">
          <p>주문과 관련된 문의사항은 [010-2049-7239]로 연락주세요.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;
