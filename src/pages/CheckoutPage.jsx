import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { resolveAssetUrl } from '../utils/assets';
import { formatStoreContacts, getDepositAccountForItems } from '../data/depositAccounts';

// 환경 변수에서 API URL 가져오기
const API_URL = import.meta.env.VITE_API_URL || '';

const CheckoutPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderName, setOrderName] = useState('');
  const [bankName, setBankName] = useState('');  // 은행명 상태 추가
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const navigate = useNavigate();
  const depositAccount = getDepositAccountForItems(orderItems);
  const storeContact = formatStoreContacts();

  useEffect(() => {
    const loadOrderItems = () => {
      try {
        const directOrderItems = localStorage.getItem('directOrderItems');
        if (!directOrderItems) {
          navigate('/store/all');
          return;
        }

        const parsedItems = JSON.parse(directOrderItems);
        if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
          localStorage.removeItem('directOrderItems');
          navigate('/store/all');
          return;
        }

        setOrderItems(parsedItems);

        const total = parsedItems.reduce((sum, item) => {
          return sum + (Number(item.price) * item.quantity);
        }, 0);

        setTotalPrice(total);
      } catch (err) {
        console.error('주문 상품 정보를 불러오는 중 오류 발생:', err);
        localStorage.removeItem('directOrderItems');
        navigate('/store/all');
      }
    };

    loadOrderItems();
  }, [navigate]);

  const normalizeDigitsAndHyphen = (value) => {
    return value.replace(/[^\d-]/g, '');
  };

  const handleCopyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(depositAccount.accountNumber);
      setCopyMessage('계좌번호가 복사되었습니다.');
    } catch (err) {
      console.error('계좌번호 복사 실패:', err);
      setCopyMessage('복사에 실패했습니다. 계좌번호를 직접 선택해주세요.');
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const trimmedOrderName = orderName.trim();
    const trimmedBankName = bankName.trim();
    const trimmedAccountNumber = accountNumber.trim();
    const trimmedPhoneNumber = phoneNumber.trim();

    if (!trimmedOrderName || !trimmedBankName || !trimmedAccountNumber || !trimmedPhoneNumber) {
      setError('입금자명, 은행명, 계좌번호, 연락처를 모두 입력해주세요.');
      return;
    }

    if (orderItems.length === 0) {
      setError('주문 상품이 없습니다. 상품을 다시 선택해주세요.');
      return;
    }

    if (trimmedPhoneNumber.replace(/\D/g, '').length < 10) {
      setError('연락처를 정확히 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      // 백엔드에 보낼 주문 데이터 구성
      const orderData = {
        accountHolder: trimmedOrderName,
        bankName: trimmedBankName,
        accountNumber: trimmedAccountNumber,
        phoneNumber: trimmedPhoneNumber,
        orders: orderItems.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          optionName: item.optionName || null
        }))
      };

      const response = await axios.post(`${API_URL}/api/store/checkout`, orderData);

      localStorage.removeItem('directOrderItems');

      navigate(`/order-complete/${response.data.publicToken}`);

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
        return resolveAssetUrl(imagePath);
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
              {orderItems.map(item => (
                <div key={`${item.id}-${item.optionName || 'default'}`} className="flex items-center py-2 border-b border-gray-200">
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
                    {item.optionName && <p className="text-xs text-gray-500">옵션: {item.optionName}</p>}
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
                  <p><span className="font-medium">상품 구분:</span> {depositAccount.label}</p>
                  <p><span className="font-medium">은행명:</span> {depositAccount.bankName}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p><span className="font-medium">계좌번호:</span> {depositAccount.accountNumber}</p>
                    <button
                      type="button"
                      onClick={handleCopyAccountNumber}
                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                    >
                      복사하기
                    </button>
                  </div>
                  {copyMessage && <p className="text-xs text-gray-600">{copyMessage}</p>}
                  <p><span className="font-medium">예금주:</span> {depositAccount.holder}</p>
                </div>
              </div>

            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-3">입금 방법:</h2>
              <div className="space-y-1 md:space-y-2 text-sm md:text-base text-gray-700">
                <p>주문 상품에 맞는 위 계좌로 총 입금액을 입금해주세요.</p>
                <p>입금시, 반드시 주문자 성함을 기재해주시기 바랍니다.</p>
                <p>입금 확인 후, 운영진이 일괄적으로 주문을 확인하고 문자로 안내드립니다.</p>
              </div>
            </div>

            <div className="mb-6 md:mb-0">
              <h2 className="text-lg md:text-xl font-semibold mb-3">유의사항:</h2>
              <div className="space-y-1 md:space-y-2 text-sm md:text-base text-gray-700">
                <p>입금 금액이 다를 경우, 주문이 취소될 수 있으니 정확한 금액을 입금해 주시기 바랍니다.</p>
                <p>입금 확인 또는 주문 관련 문의는 [{storeContact}]로 연락해주세요.</p>
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
                <p className="mt-1 text-xs text-gray-500">실제 입금자명과 동일하게 입력해주세요.</p>
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
                  onChange={(e) => setAccountNumber(normalizeDigitsAndHyphen(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="입금자 계좌번호"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">연락처</h2>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(normalizeDigitsAndHyphen(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="연락 가능한 전화번호"
                  inputMode="tel"
                  required
                />
              </div>

              {/* 주문 상품 목록 - 데스크톱 */}
              <div className="hidden md:block mb-6 border-t border-gray-300 pt-4">
                <h2 className="text-xl font-semibold mb-4">주문 상품</h2>
                {orderItems.map(item => (
                  <div key={`${item.id}-${item.optionName || 'default'}`} className="flex items-center py-2 border-b border-gray-200">
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
                      {item.optionName && <p className="text-xs text-gray-500">옵션: {item.optionName}</p>}
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
	                  className={`w-full py-3 text-white font-medium transition-colors ${
	                    isSubmitting
	                      ? 'bg-gray-400 cursor-not-allowed'
	                      : 'bg-indigo-600 hover:bg-indigo-700'
	                  }`}
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
