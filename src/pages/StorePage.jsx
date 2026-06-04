import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { getStoreImageSrc, setStoreImageFallback } from '../utils/storeImages';
import {
  getStoreProductDisplayItem,
  isStoreProductSoldOut
} from '../data/storeProductDetails';

const StorePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const itemsUrl = `${API_URL}/api/store/items`;
        
        const itemsResponse = await axios.get(itemsUrl);
        const sortedItems = [...itemsResponse.data].sort((a, b) => {
          return a.id - b.id;
        }).map(getStoreProductDisplayItem);
        setItems(sortedItems);
        
        setLoading(false);
      } catch (err) {
        setError('상품을 불러오는 중 오류가 발생했습니다');
        setLoading(false);
        console.error('Error fetching data:', err);
        console.error('Error details:', err.response ? err.response.data : err.message);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      <div className="px-4 py-8" aria-hidden="true" />
      
      <div className="items-grid bg-white py-8">
        <div className="mx-auto w-full max-w-7xl px-4">
          {loading ? (
            <p className="text-center text-black">로딩 중...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : items.length === 0 ? (
            <div className="flex justify-center items-center" style={{ minHeight: '300px' }}>
              <p className="text-center text-black text-lg">표시할 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-x-[32px] lg:gap-x-[44px] md:gap-y-[40px]">
              {items.map(item => (
                <div key={item.id} className="item-card text-center">
                  <Link to={`/store/item/${item.id}`}>
                    <div className="relative w-full aspect-square overflow-hidden mb-3 bg-gray-100">
                      <img 
                        src={getStoreImageSrc(item.itemImagePath)}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => setStoreImageFallback(e)}
                      />
                      {isStoreProductSoldOut(item) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <span className="border border-black bg-white px-3 py-1 text-xs font-semibold tracking-[0.16em] text-black">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-base md:text-lg font-medium text-black truncate text-center">{item.name}</h3>
                  </Link>
                  <p className="text-center text-gray-800 text-sm md:text-base">{item.price ? Number(item.price).toLocaleString() : '0'} ₩</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
