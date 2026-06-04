import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { getStoreImageSrc, setStoreImageFallback } from '../utils/storeImages';
import {
  getStoreOptionMaxQuantity,
  getStoreProductDetail,
  getStoreProductDisplayItem,
  getStoreProductMaxQuantity,
  isStoreOptionSoldOut,
  isStoreProductSoldOut
} from '../data/storeProductDetails';

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

        const itemResponse = await axios.get(`${API_URL}/api/store/items/${itemId}`);
        setItem(getStoreProductDisplayItem(itemResponse.data));
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

  const handleQuantityChange = (e) => {
    const maxQuantity = getStoreProductMaxQuantity(item);
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setQuantity(Math.min(newQuantity, maxQuantity));
    }
  };

  const incrementQuantity = () => {
    const maxQuantity = getStoreProductMaxQuantity(item);
    setQuantity(Math.min(quantity + 1, maxQuantity));
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const updateOptionQuantity = (optionValue, nextQuantity) => {
    const productDetail = getStoreProductDetail(item);
    const option = productDetail.options?.find((currentOption) => currentOption.value === optionValue);
    const maxQuantity = getStoreOptionMaxQuantity(option);
    const normalizedQuantity = Math.min(Math.max(0, Number(nextQuantity) || 0), maxQuantity);
    setOptionQuantities((prev) => ({
      ...prev,
      [optionValue]: normalizedQuantity
    }));
    setOptionError('');
  };

  const incrementOptionQuantity = (optionValue) => {
    const productDetail = getStoreProductDetail(item);
    const option = productDetail.options?.find((currentOption) => currentOption.value === optionValue);
    const maxQuantity = getStoreOptionMaxQuantity(option);
    setOptionQuantities((prev) => ({
      ...prev,
      [optionValue]: Math.min((prev[optionValue] || 0) + 1, maxQuantity)
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

    if (isStoreProductSoldOut(item)) {
      setOptionError('현재 품절된 상품입니다.');
      return;
    }

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
          quantity: Math.min(optionQuantities[option.value] || 0, getStoreOptionMaxQuantity(option)),
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

    const maxQuantity = getStoreProductMaxQuantity(item);

    localStorage.setItem('directOrderItems', JSON.stringify([{
      ...baseCheckoutItem,
      quantity: Math.min(quantity, maxQuantity),
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
  const isSoldOut = isStoreProductSoldOut(item);

  return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      <div className="px-4 py-6 md:py-7" aria-hidden="true" />

      <div className="mx-auto w-full max-w-7xl px-4 py-5 md:py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(300px,430px)] md:gap-10 lg:gap-14">
          <div className="w-full md:col-start-1 md:row-start-1">
            <div className="w-full overflow-hidden bg-gray-100">
              <img
                src={getStoreImageSrc(item.itemImagePath)}
                alt={item.name}
                className="block w-full h-auto object-cover"
                onError={(e) => setStoreImageFallback(e)}
              />
            </div>
          </div>

          <aside className="w-full md:col-start-2 md:row-start-1 md:sticky md:top-20 md:self-start">
            <div className="bg-white">
              <h1 className="mb-1.5 text-2xl font-medium leading-tight text-black md:text-[22px]">{item.name}</h1>
              <p className="mb-3 text-base text-gray-800">{Number(item.price).toLocaleString()} ₩</p>

              {hasDescription && (
                <div className="mb-3 space-y-1 text-xs leading-[1.55] text-gray-700 md:text-[12px]">
                  {productDetail.description.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              )}

              {hasDetails && (
                <div className="mb-3 border-t border-gray-200 pt-3">
                  <h2 className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-black">DETAIL</h2>
                  <dl className="space-y-1.5 text-xs text-gray-700">
                    {productDetail.details.map((detail) => (
                      <div key={detail.label} className="grid grid-cols-[88px_1fr] gap-3">
                        <dt className="font-medium text-black">{detail.label}</dt>
                        <dd>{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {hasOptions && (
                <div className="mb-3">
                  <p className="mb-1.5 text-xs text-gray-700">{productDetail.optionLabel || '옵션'}별 수량</p>
                  <div className="space-y-1.5">
                    {productDetail.options.map((option) => {
                      const optionSoldOut = isSoldOut || isStoreOptionSoldOut(option);
                      const optionQuantity = optionQuantities[option.value] || 0;

                      return (
                      <div
                        key={option.value}
                        className={`flex items-center justify-between border px-3 py-2 ${
                          optionSoldOut ? 'border-gray-100 bg-gray-50 text-gray-400' : 'border-gray-200'
                        }`}
                      >
                        <div>
                          <span className={`text-xs font-medium ${optionSoldOut ? 'text-gray-400' : 'text-black'}`}>
                            {option.label}
                          </span>
                          {optionSoldOut && <span className="ml-2 text-[11px] text-red-500">품절</span>}
                        </div>
                        <div className="inline-flex h-8 overflow-hidden rounded-full border border-gray-300 bg-white">
                          <button
                            type="button"
                            className="flex w-8 items-center justify-center text-sm leading-none text-gray-600 transition-colors hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:text-gray-300"
                            onClick={() => decrementOptionQuantity(option.value)}
                            disabled={optionSoldOut || optionQuantity <= 0}
                            aria-label={`${option.label} 수량 감소`}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={optionQuantity}
                            onChange={(e) => updateOptionQuantity(option.value, e.target.value)}
                            className="h-full w-10 border-x border-gray-200 text-center text-xs text-black outline-none [appearance:textfield] disabled:bg-gray-50 disabled:text-gray-300 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            min="0"
                            max={getStoreOptionMaxQuantity(option)}
                            disabled={optionSoldOut}
                            aria-label={`${option.label} 수량`}
                          />
                          <button
                            type="button"
                            className="flex w-8 items-center justify-center text-sm leading-none text-gray-600 transition-colors hover:bg-gray-100 hover:text-black disabled:cursor-not-allowed disabled:text-gray-300"
                            onClick={() => incrementOptionQuantity(option.value)}
                            disabled={optionSoldOut || optionQuantity >= getStoreOptionMaxQuantity(option)}
                            aria-label={`${option.label} 수량 증가`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                  {optionError && <p className="mt-1.5 text-xs text-red-500">{optionError}</p>}
                </div>
              )}

              {!hasOptions && (
                <div className="mb-3">
                  <p className="mb-1.5 text-xs text-gray-700">수량</p>
                  <div className="inline-flex h-9 overflow-hidden rounded-full border border-gray-300 bg-white shadow-[0_1px_10px_rgba(0,0,0,0.04)]">
                    <button
                      type="button"
                      className="flex w-9 items-center justify-center text-base leading-none text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
                      onClick={decrementQuantity}
                      disabled={isSoldOut || quantity <= 1}
                      aria-label="수량 감소"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-full w-12 border-x border-gray-200 text-center text-xs text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      min="1"
                      max={getStoreProductMaxQuantity(item)}
                      disabled={isSoldOut}
                      aria-label="수량"
                    />
                    <button
                      type="button"
                      className="flex w-9 items-center justify-center text-base leading-none text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
                      onClick={incrementQuantity}
                      disabled={isSoldOut || quantity >= getStoreProductMaxQuantity(item)}
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-3 flex items-center justify-between border-t border-gray-200 pt-3 text-xs">
                <span className="text-gray-500">예상 주문금액</span>
                <span className="text-base font-medium text-black">
                  {estimatedTotalPrice.toLocaleString()} ₩
                </span>
              </div>

              <button
                className={`w-full py-2.5 text-sm font-medium text-white transition-colors ${
                  isSoldOut
                    ? 'cursor-not-allowed bg-gray-400'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                onClick={handleDirectCheckout}
                disabled={isSoldOut}
              >
                {isSoldOut ? 'SOLD OUT' : 'BUY NOW'}
              </button>
            </div>
          </aside>

          {item.descriptionImagePath && (
            <div className="w-full md:col-start-1 md:row-start-2">
              <img
                src={getStoreImageSrc(item.descriptionImagePath)}
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
