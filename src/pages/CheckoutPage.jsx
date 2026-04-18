import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 환경 변수에서 API URL 가져오기
const API_URL = process.env.REACT_APP_API_URL || '';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderName, setOrderName] = useState('');
  const [bankName, setBankName] = useState('');  // 은행명 상태 추가
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 로컬 스토리지에서 장바구니 불러오기
  useEffect(() => {
    const loadCart = () => {
      // 체크아웃 페이지로 이동 시 선택된 상품만 포함
      const selectedCart = localStorage.getItem('selectedCart');
      if (selectedCart) {
        const parsedCart = JSON.parse(selectedCart);
        setCartItems(parsedCart);

        // 총 금액 계산
        const total = parsedCart.reduce((sum, item) => {
          return sum + (Number(item.price) * item.quantity);
        }, 0);

        setTotalPrice(total);
      } else {
        // 선택된 상품이 없을 경우 장바구니 페이지로 리다이렉트
        navigate('/cart');
      }
    };

    loadCart();
  }, [navigate]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!orderName || !bankName || !accountNumber || !phoneNumber) {
      setError('입금자명, 은행명, 계좌번호, 연락처를 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // 백엔드에 보낼 주문 데이터 구성
      const orderData = {
        accountHolder: orderName,
        bankName: bankName,  // 은행명 추가
        accountNumber: accountNumber,
        phoneNumber: phoneNumber,
        orders: cartItems.map(item => ({
          itemId: item.id,
          quantity: item.quantity
        }))
      };

      // 백엔드 API 호출하여 주문 생성
      const response = await axios.post(`${API_URL}/api/store/checkout`, orderData);

      // 주문 성공 시 장바구니에서 주문한 상품 제거
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        const orderedItemIds = cartItems.map(item => item.id);
        const updatedCart = parsedCart.filter(item => !orderedItemIds.includes(item.id));
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }

      // 선택된 장바구니 상품 정보 삭제
      localStorage.removeItem('selectedCart');

      // 장바구니 상태 업데이트를 위한 이벤트 발생
      window.dispatchEvent(new Event('storage'));

      // 주문 완료 페이지로 이동
      navigate(`/order-complete/${response.data.id}`);

    } catch (err) {
      console.error('주문 처리 중 오류 발생:', err);
      setError('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 이미지 경로 처리 함수
  const getImageSrc = (imagePath) => {
    try {
      // assets/ 경로로 시작하는 경우 require로 가져오기
      if (imagePath && imagePath.startsWith('assets/')) {
        return require(`../${imagePath}`);
      }
      return imagePath || 'https://via.placeholder.com/80x80?text=No+Image';
    } catch (error) {
      console.error('Error loading image:', error);
      return 'https://via.placeholder.com/80x80?text=Error+Loading+Image';
    }
  };

  return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb border-t border-b border-gray-300 py-2 px-4">
        <div className="mx-auto w-full max-w-7xl px-4">
          <nav className="text-sm text-black">
            <Link to="/store" className="hover:underline">STORE</Link>
            {' > '}
            <Link to="/cart" className="hover:underline">장바구니</Link>
            {' > '}
            <span>주문하기</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto py-4 md:py-8 px-4 w-full max-w-7xl">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 text-center">주문하기</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 md:mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:flex-wrap">
          {/* 모바일: 주문 상품 목록 먼저 표시 */}
          <div className="w-full md:hidden mb-6">
            <div className="border-t border-gray-300 pt-4">
              <h2 className="text-lg font-semibold mb-3">주문 상품</h2>
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center py-2 border-b border-gray-200">
                  <div className="w-[50px] h-[50px] mr-3 overflow-hidden">
                    <img
                      src={getImageSrc(item.imagePath)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                      }}
                    />
                  </div>
                  <div className="flex-1 mr-2">
                    <p className="font-medium text-sm">{item.name || '상품명 없음'}</p>
                    <p className="text-xs text-gray-600">{Number(item.price).toLocaleString()} ₩ × {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{(Number(item.price) * item.quantity).toLocaleString()} ₩</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center py-3 border-b border-gray-300">
                <span className="text-base font-semibold">총 입금액</span>
                <span className="text-lg font-bold">{totalPrice.toLocaleString()} ₩</span>
              </div>
            </div>
          </div>

          {/* 입금 정보 */}
          <div className="w-full md:w-1/2 md:pr-4 mb-6 md:mb-0">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-3">입금 계좌 정보:</h2>
              <div className="space-y-1 md:space-y-2 text-sm md:text-base">
                <p><span className="font-medium">은행명:</span> IBK기업은행</p>
                <p><span className="font-medium">계좌번호:</span> 11116875301018</p>
                <p><span className="font-medium">예금주:</span> 박상현</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-3">입금 방법:</h2>
              <div className="space-y-1 md:space-y-2 text-sm md:text-base text-gray-700">
                <p>위의 계좌로 인터넷 뱅킹을 통해 입금해 주시기 바랍니다.</p>
                <p>입금시, 반드시 주문자 성함을 기재해주시기 바랍니다.</p>
                <p>입금 후, 매일 오전 9시에 일괄적으로 주문을 확인하고, 문자를 통해 결제확인을 도와드리고 있습니다.</p>
              </div>
            </div>

            <div className="mb-6 md:mb-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3">유의사항:</h2>
              <div className="space-y-1 md:space-y-2 text-sm md:text-base text-gray-700">
                <p>입금 금액이 다를 경우, 주문이 취소될 수 있으니 정확한 금액을 입금해 주시기 바랍니다.</p>
                <p>입금 후 다음날 오후 1시까지 확인되지 않을 경우, 혹은 추가로 문의사항이 있을 경우 [010-2049-7239]로 연락주시면 신속하게 처리해드리겠습니다.</p>
              </div>
            </div>
          </div>

          {/* 주문자 정보 및 제품 목록 */}
          <div className="w-full md:w-1/2 md:pl-4">
            <form onSubmit={handleOrderSubmit}>
              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">입금자 명</h2>
                <input
                  type="text"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="입금자 성함을 입력하세요"
                  required
                />
              </div>

              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">은행명</h2>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="입금하실 은행명을 입력하세요"
                  required
                />
              </div>

              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">입금자 계좌번호</h2>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="입금자 계좌번호"
                  required
                />
              </div>

              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">연락처</h2>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="연락 가능한 전화번호"
                  required
                />
              </div>

              {/* 주문 상품 목록 - 데스크톱 */}
              <div className="hidden md:block mb-6 border-t border-gray-300 pt-4">
                <h2 className="text-xl font-semibold mb-4">주문 상품</h2>
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center py-2 border-b border-gray-200">
                    <div className="w-[50px] h-[50px] mr-3 overflow-hidden">
                      <img
                        src={getImageSrc(item.imagePath)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                        }}
                      />
                    </div>
                    <div className="flex-1 mr-3">
                      <p className="font-medium">{item.name || '상품명 없음'}</p>
                      <p className="text-sm text-gray-600">{Number(item.price).toLocaleString()} ₩ × {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{(Number(item.price) * item.quantity).toLocaleString()} ₩</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 pt-4 md:pt-6">
                {/* 총 입금액 - 데스크톱 */}
                <div className="hidden md:flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">총 입금액</span>
                  <span className="text-xl font-bold">{totalPrice.toLocaleString()} ₩</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '처리 중...' : '예약 주문하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;