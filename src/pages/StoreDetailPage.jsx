import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { resolveAssetUrl } from '../utils/assets';
import { getStoreProductDetail } from '../data/storeProductDetails';

// 환경 변수에서 API URL 가져오기
const API_URL = import.meta.env.VITE_API_URL || '';
const StoreDetailPage = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [optionQuantities, setOptionQuantities] = useState({});
  const [optionError, setOptionError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 상품 상세 정보 가져오기
        const itemResponse = await axios.get(`${API_URL}/api/store/items/${itemId}`);
        setItem(itemResponse.data);
        setOptionQuantities({});
        setOptionError('');

        setLoading(false);
      } catch (err) {
        setError('상품을 불러오는 중 오류가 발생했습니다');
        setLoading(false);
        console.error('Error fetching item:', err);
        console.error('Error details:', err.response ? err.response.data : err.message);
      }
    };

    fetchData();
  }, [itemId]);

  // 이미지 경로 처리 함수
  const getImageSrc = (imagePath) => {
    try {
      // assets/ 경로로 시작하는 경우 require로 가져오기
      if (imagePath && imagePath.startsWith('assets/')) {
        return resolveAssetUrl(imagePath);
      }
      return imagePath || 'https://via.placeholder.com/300x300?text=No+Image';
    } catch (error) {
      console.error('Error loading image:', error);
      return 'https://via.placeholder.com/300x300?text=Error+Loading+Image';
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const updateOptionQuantity = (optionValue, nextQuantity) => {
    const normalizedQuantity = Math.max(0, Number(nextQuantity) || 0);
    setOptionQuantities((prev) => ({
      ...prev,
      [optionValue]: normalizedQuantity
    }));
    setOptionError('');
  };

  const incrementOptionQuantity = (optionValue) => {
    setOptionQuantities((prev) => ({
      ...prev,
      [optionValue]: (prev[optionValue] || 0) + 1
    }));
    setOptionError('');
  };

  const decrementOptionQuantity = (optionValue) => {
    setOptionQuantities((prev) => ({
      ...prev,
      [optionValue]: Math.max(0, (prev[optionValue] || 0) - 1)
    }));
  };

  const handleDirectCheckout = () => {
    const productDetail = getStoreProductDetail(item);
    const hasOptions = productDetail.options?.length > 0;

    const baseCheckoutItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      imagePath: item.itemImagePath,
      teamId: item.teamId,
      teamName: item.teamName,
      creator: item.creator
    };

    if (hasOptions) {
      const checkoutItems = productDetail.options
        .map((option) => ({
          ...baseCheckoutItem,
          quantity: optionQuantities[option.value] || 0,
          optionName: option.value
        }))
        .filter((checkoutItem) => checkoutItem.quantity > 0);

      if (checkoutItems.length === 0) {
        setOptionError(`${productDetail.optionLabel || '옵션'}별 수량을 1개 이상 선택해주세요.`);
        return;
      }

      localStorage.setItem('directOrderItems', JSON.stringify(checkoutItems));
      navigate('/checkout');
      return;
    }

    localStorage.setItem('directOrderItems', JSON.stringify([{
      ...baseCheckoutItem,
      quantity: quantity,
      optionName: ''
    }]));

    navigate('/checkout');
  };

  if (loading) return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      <div className="mx-auto py-8 px-4 w-full max-w-7xl">
        <p className="text-center text-black">로딩 중...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      <div className="mx-auto py-8 px-4 w-full max-w-7xl">
        <p className="text-center text-red-500">{error}</p>
      </div>
    </div>
  );

  if (!item) return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      <div className="mx-auto py-8 px-4 w-full max-w-7xl">
        <p className="text-center text-black text-lg">상품을 찾을 수 없습니다.</p>
      </div>
    </div>
  );

  const productDetail = getStoreProductDetail(item);
  const hasDescription = productDetail.description?.length > 0;
  const hasDetails = productDetail.details?.length > 0;
  const hasOptions = productDetail.options?.length > 0;
  const optionTotalQuantity = hasOptions
    ? productDetail.options.reduce((sum, option) => sum + (optionQuantities[option.value] || 0), 0)
    : 0;
  const estimatedQuantity = hasOptions ? optionTotalQuantity : quantity;
  const estimatedTotalPrice = Number(item.price) * estimatedQuantity;

  return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      {/* Spacer preserves the former breadcrumb/category vertical rhythm. */}
      <div className="px-4 py-8" aria-hidden="true" />

      {/* Product Detail Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] md:gap-12 lg:gap-16">
          {/* Main Product Image */}
          <div className="w-full md:col-start-1 md:row-start-1">
            <div className="w-full overflow-hidden bg-gray-100">
              <img
                src={getImageSrc(item.itemImagePath)}
                alt={item.name}
                className="block w-full h-auto object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', item.itemImagePath);
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <aside className="w-full md:col-start-2 md:row-start-1 md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:self-start md:overflow-y-auto md:pr-2">
            <div className="bg-white">
              <h1 className="mb-2 text-2xl font-medium leading-tight text-black md:text-[26px]">{item.name}</h1>
              <p className="mb-5 text-lg text-gray-800">{Number(item.price).toLocaleString()} ₩</p>

              {hasDescription && (
                <div className="mb-5 space-y-2 text-sm leading-6 text-gray-700">
                  {productDetail.description.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              )}

              {hasDetails && (
                <div className="mb-5 border-t border-gray-200 pt-4">
                  <h2 className="mb-3 text-xs font-semibold tracking-[0.18em] text-black">DETAIL</h2>
                  <dl className="space-y-2 text-sm text-gray-700">
                    {productDetail.details.map((detail) => (
                      <div key={detail.label} className="grid grid-cols-[100px_1fr] gap-3">
                        <dt className="font-medium text-black">{detail.label}</dt>
                        <dd>{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {hasOptions && (
                <div className="mb-5">
                  <p className="mb-2 text-sm text-gray-700">{productDetail.optionLabel || '옵션'}별 수량</p>
                  <div className="space-y-2">
                    {productDetail.options.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center justify-between border border-gray-200 px-4 py-2.5"
                      >
                        <span className="text-sm font-medium text-black">{option.label}</span>
                        <div className="inline-flex h-9 overflow-hidden rounded-full border border-gray-300 bg-white">
                          <button
                            type="button"
                            className="flex w-9 items-center justify-center text-base leading-none text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
                            onClick={() => decrementOptionQuantity(option.value)}
                            aria-label={`${option.label} 수량 감소`}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={optionQuantities[option.value] || 0}
                            onChange={(e) => updateOptionQuantity(option.value, e.target.value)}
                            className="h-full w-12 border-x border-gray-200 text-center text-sm text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            min="0"
                            aria-label={`${option.label} 수량`}
                          />
                          <button
                            type="button"
                            className="flex w-9 items-center justify-center text-base leading-none text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
                            onClick={() => incrementOptionQuantity(option.value)}
                            aria-label={`${option.label} 수량 증가`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {optionError && <p className="mt-2 text-sm text-red-500">{optionError}</p>}
                </div>
              )}

              {!hasOptions && (
                <div className="mb-5">
                  <p className="mb-2 text-sm text-gray-700">수량</p>
                  <div className="inline-flex h-11 overflow-hidden rounded-full border border-gray-300 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.04)]">
                    <button
                      type="button"
                      className="flex w-11 items-center justify-center text-lg leading-none text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
                      onClick={decrementQuantity}
                      aria-label="수량 감소"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-full w-14 border-x border-gray-200 text-center text-sm text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      min="1"
                      aria-label="수량"
                    />
                    <button
                      type="button"
                      className="flex w-11 items-center justify-center text-lg leading-none text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
                      onClick={incrementQuantity}
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-4 flex items-center justify-between border-t border-gray-200 pt-4 text-sm">
                <span className="text-gray-500">예상 주문금액</span>
                <span className="text-lg font-medium text-black">
                  {estimatedTotalPrice.toLocaleString()} ₩
                </span>
              </div>

              {/* Action Buttons */}
              <button
                className="w-full py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                onClick={handleDirectCheckout}
              >
                BUY NOW
              </button>
            </div>
          </aside>

          {item.descriptionImagePath && (
            <div className="w-full md:col-start-1 md:row-start-2">
              <img
                src={getImageSrc(item.descriptionImagePath)}
                alt={`${item.name} 상세 설명`}
                className="block w-full h-auto"
                onError={(e) => {
                  console.error('Description image failed to load:', item.descriptionImagePath);
                  e.target.onerror = null;
                  e.target.src = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;
