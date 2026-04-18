import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

// 환경 변수에서 API URL 가져오기
const API_URL = process.env.REACT_APP_API_URL || '';

const StorePage = () => {
  const [items, setItems] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // URL 파라미터에서 teamId 가져오기
  const { teamId } = useParams();
  
  // 전체보기 여부 결정
  const isAllView = !teamId;
  
  // 선택된 팀 정보
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 팀 정보 가져오기
        console.log('Fetching teams from:', `${API_URL}/api/store/teams`);
        const teamsResponse = await axios.get(`${API_URL}/api/store/teams`);
        console.log('Teams response:', teamsResponse.data);
        setTeams(teamsResponse.data);
        
        // teamId가 제공된 경우 해당 팀 찾기
        if (teamId) {
          // eslint-disable-next-line eqeqeq
          const team = teamsResponse.data.find(t => t.id === Number(teamId));
          setSelectedTeam(team);
        }
        
        // 상품 목록 가져오기
        let itemsUrl = isAllView 
          ? `${API_URL}/api/store/items` 
          : `${API_URL}/api/store/items/team/${teamId}`;
          
        console.log('Fetching items from:', itemsUrl);
        const itemsResponse = await axios.get(itemsUrl);
        console.log('Items response data:', itemsResponse.data);
        console.log('Items count:', itemsResponse.data.length);
        setItems(itemsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('상품을 불러오는 중 오류가 발생했습니다');
        setLoading(false);
        console.error('Error fetching data:', err);
        console.error('Error details:', err.response ? err.response.data : err.message);
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, isAllView]);

  // 이미지 경로 처리 함수
  const getImageSrc = (imagePath) => {
    try {
      // assets/ 경로로 시작하는 경우 require로 가져오기
      if (imagePath && imagePath.startsWith('assets/')) {
        return require(`../${imagePath}`);
      }
      return imagePath || 'https://via.placeholder.com/300x300?text=No+Image';
    } catch (error) {
      console.error('Error loading image:', error);
      return 'https://via.placeholder.com/300x300?text=Error+Loading+Image';
    }
  };

  // 모바일 메뉴 토글 함수
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="store-page" style={{ backgroundColor: 'white', minHeight: 'calc(100vh - 150px)' }}>
      
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb border-t border-b border-gray-300 py-2 px-4">
        <div className="mx-auto w-full max-w-7xl px-4">
          <nav className="text-sm text-black">
            <Link to="/store" className="hover:underline">STORE</Link>
            {' > '}
            <Link to="/store/all" className="hover:underline">
              {isAllView ? '전체보기' : (selectedTeam?.name || '카테고리')}
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Team Categories - Desktop */}
      <div className="team-categories border-b border-gray-300 py-3 px-4 hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-4">
          <ul className="flex flex-wrap space-x-4">
            <li className={`${isAllView ? 'font-bold' : ''} text-black`}>
              <Link to="/store/all">전체보기</Link>
            </li>
            {teams.map(team => (
              <li 
                key={team.id} 
                // eslint-disable-next-line eqeqeq
                className={`${teamId === String(team.id) ? 'font-bold' : ''} text-black`}
              >
                <Link to={`/store/team/${team.id}`}>{team.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Mobile Category Dropdown */}
      <div className="md:hidden border-b border-gray-300">
        <div className="mx-auto w-full px-4 py-2">
          <div 
            className="flex justify-between items-center py-2"
            onClick={toggleMobileMenu}
          >
            <span className="font-medium text-black">
              {isAllView ? '전체보기' : (selectedTeam?.name || '카테고리')}
            </span>
            <svg 
              className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          
          {mobileMenuOpen && (
            <div className="py-2 bg-white shadow-md absolute left-0 right-0 z-10">
              <ul className="px-4">
                <li className={`py-2 border-b border-gray-100 ${isAllView ? 'font-bold' : ''}`}>
                  <Link 
                    to="/store/all" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full"
                  >
                    전체보기
                  </Link>
                </li>
                {teams.map(team => (
                  <li 
                    key={team.id} 
                    // eslint-disable-next-line eqeqeq
                    className={`py-2 border-b border-gray-100 ${teamId === String(team.id) ? 'font-bold' : ''}`}
                  >
                    <Link 
                      to={`/store/team/${team.id}`} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full"
                    >
                      {team.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-x-[60px] md:gap-y-[40px]">
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
                    <div className="text-gray-800 mb-1 text-sm md:text-base">{item.creator}</div>
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