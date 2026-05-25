import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { resolveAssetUrl } from '../utils/assets';

// 환경 변수에서 API URL 가져오기
const API_URL = import.meta.env.VITE_API_URL || '';

const StorePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 상품 목록 가져오기
        const itemsUrl = `${API_URL}/api/store/items`;
        
        const itemsResponse = await axios.get(itemsUrl);
        const sortedItems = [...itemsResponse.data].sort((a, b) => {
          return a.id - b.id;
        });
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

  return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      {/* Spacer preserves the former breadcrumb/category vertical rhythm. */}
      <div className="px-4 py-8" aria-hidden="true" />
      
      {/* Items Grid with white background */}
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
                <div key={item.id} className="item-card">
                  <Link to={`/store/item/${item.id}`}>
                    <div className="w-full aspect-square overflow-hidden mb-3 bg-gray-100">
                      <img 
                        src={getImageSrc(item.itemImagePath)}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          console.error('Image failed to load:', item.itemImagePath);
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=Error+Loading+Image';
                        }}
                      />
                    </div>
                    <h3 className="text-base md:text-lg font-medium text-black truncate">{item.name}</h3>
                  </Link>
                  <p className="text-gray-800 text-sm md:text-base">{item.price ? Number(item.price).toLocaleString() : '0'} ₩</p>
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
