import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  
  // 아이템별 선택 상태를 관리하는 상태 추가
  const [selectedItems, setSelectedItems] = useState({});
  const [allSelected, setAllSelected] = useState(true);

  // 로컬 스토리지에서 장바구니 불러오기
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        
        // 초기에 모든 아이템 선택 상태로 설정
        const initialSelectedState = {};
        parsedCart.forEach(item => {
          initialSelectedState[item.id] = true;
        });
        setSelectedItems(initialSelectedState);
        
        // 총 금액 계산
        calculateTotalPrice(parsedCart, initialSelectedState);
      }
    };
    
    loadCart();
    
    // 로컬 스토리지 변경 감지
    window.addEventListener('storage', loadCart);
    
    return () => {
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  // 선택된 상품의 총 금액 계산
  const calculateTotalPrice = (items, selected) => {
    const total = items.reduce((sum, item) => {
      return selected[item.id] ? sum + (Number(item.price) * item.quantity) : sum;
    }, 0);
    
    setTotalPrice(total);
  };

  // 장바구니 항목 제거
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    
    // 선택 상태에서도 제거
    const updatedSelectedItems = { ...selectedItems };
    delete updatedSelectedItems[itemId];
    
    setCartItems(updatedCart);
    setSelectedItems(updatedSelectedItems);
    
    calculateTotalPrice(updatedCart, updatedSelectedItems);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  // 개별 항목 선택 변경 처리
  const handleItemSelect = (itemId) => {
    const updatedSelectedItems = {
      ...selectedItems,
      [itemId]: !selectedItems[itemId]
    };
    
    setSelectedItems(updatedSelectedItems);
    
    // 모든 항목이 선택되었는지 확인
    const allItemsSelected = Object.values(updatedSelectedItems).every(selected => selected);
    setAllSelected(allItemsSelected);
    
    calculateTotalPrice(cartItems, updatedSelectedItems);
  };

  // 전체 선택 처리
  const toggleSelectAll = () => {
    const newAllSelected = !allSelected;
    setAllSelected(newAllSelected);
    
    // 모든 항목의 선택 상태 변경
    const updatedSelectedItems = {};
    cartItems.forEach(item => {
      updatedSelectedItems[item.id] = newAllSelected;
    });
    
    setSelectedItems(updatedSelectedItems);
    calculateTotalPrice(cartItems, updatedSelectedItems);
  };
  
  // 주문하기 버튼 클릭 시 처리
  const handleCheckout = () => {
    // 선택된 상품만 필터링
    const selectedCartItems = cartItems.filter(item => selectedItems[item.id]);
    
    if (selectedCartItems.length === 0) {
      alert('선택된 상품이 없습니다.');
      return;
    }
    
    // 선택된 상품만 localStorage에 저장
    localStorage.setItem('selectedCart', JSON.stringify(selectedCartItems));
    
    // 체크아웃 페이지로 이동
    navigate('/checkout');
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
            <span>장바구니</span>
          </nav>
        </div>
      </div>
      
      <div className="mx-auto py-4 md:py-8 px-4 w-full max-w-7xl">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 text-center">장바구니</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-8 md:py-16">
            <p className="text-gray-500 text-base md:text-lg mb-4 md:mb-8">장바구니가 비어있습니다.</p>
            <Link 
              to="/store/all" 
              className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition-colors"
            >
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <>
            {/* 전체 선택 체크박스 */}
            <div className="flex items-center pb-3 border-b border-gray-300">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="selectAll" 
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 cursor-pointer"
                />
                <label htmlFor="selectAll" className="ml-2 text-sm cursor-pointer">전체 선택</label>
              </div>
            </div>
            
            {/* 장바구니 아이템 목록 */}
            <div className="mt-2 md:mt-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row md:items-center py-3 border-b border-gray-200">
                  <div className="flex items-center mb-2 md:mb-0">
                    {/* 체크박스 */}
                    <input 
                      type="checkbox" 
                      id={`item-${item.id}`}
                      checked={selectedItems[item.id] || false}
                      onChange={() => handleItemSelect(item.id)}
                      className="h-5 w-5 mr-3 cursor-pointer"
                    />
                    
                    {/* 상품 이미지 */}
                    <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] mr-3 overflow-hidden">
                      <img 
                        src={getImageSrc(item.imagePath)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80x80?text=Error';
                        }}
                      />
                    </div>
                    
                    {/* 상품 정보 - 모바일에서는 이미지 옆에 표시 */}
                    <div className="flex-grow md:w-auto">
                      <h3 className="font-medium text-sm md:text-base">{item.name}</h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {Number(item.price).toLocaleString()} ₩
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center ml-8 md:ml-auto">
                    {/* 수량 */}
                    <div className="text-center mr-4">
                      <span className="text-sm md:text-base">x{item.quantity}</span>
                    </div>
                    
                    {/* 삭제 버튼 */}
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer p-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 총 금액 및 결제 버튼 - 모바일에서는 하단에 고정 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:static md:mt-8 md:border-t md:border-gray-300 md:pt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base md:text-lg font-semibold">총 구매금액</span>
                <span className="text-lg md:text-xl font-bold">{totalPrice.toLocaleString()} ₩</span>
              </div>
              
              <button 
                className="w-full py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                onClick={handleCheckout}
              >
                예약 주문하기
              </button>
            </div>
            
            {/* 모바일에서 하단 고정 버튼 영역 보상을 위한 패딩 */}
            <div className="h-32 md:h-0 md:hidden"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;