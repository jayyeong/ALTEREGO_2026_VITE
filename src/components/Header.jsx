import React, { useMemo, useRef, useState } from 'react';
import {
  Youtube,
  Instagram,
  Menu,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  // 모바일 상태
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 모바일 아코디언: 현재 펼쳐진 1차 메뉴 라벨
  const [expandedMobile, setExpandedMobile] = useState(null);

  // 데스크탑 드롭다운 상태
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ left: 0, width: 0 });

  const navWrapRef = useRef(null);
  const menuItemRefs = useRef({});

  const closeMobile = () => {
    setIsMobileOpen(false);
    setExpandedMobile(null);
  };

  /**
   * ✅ 최종 메뉴 구조 (PC/모바일 공통)
   */
  const menus = useMemo(
    () => [
      { label: 'INFO', path: '/show-info' },
      { label: 'PROJECT', path: '/project/' },
      {
        label: 'IMAGE',
        path: '/project/look-book',
        subItems: [
          { name: 'LOOKBOOK', path: '/project/look-book' },
          { name: 'RUNWAY', path: '/project/runway' }
        ]
      },
      { label: 'STORE', path: '/store/all' },
      {
        label: 'BEHIND',
        path: '/behind/show',
        subItems: [
          { name: 'SHOW', path: '/behind/show' },
          { name: 'BROCHURE', path: '/behind/brochure' },
          { name: 'MAKING', path: '/behind/making' }
        ]
      },
      { label: 'ARCHIVE', path: '/archive' }
    ],
    []
  );

  // =========================
  // ✅ PC 드롭다운
  // =========================
  const openDropdown = (menuLabel) => {
    const target = menus.find(m => m.label === menuLabel);
    if (!target?.subItems?.length) {
      setHoveredMenu(null);
      return;
    }

    setHoveredMenu(menuLabel);

    const wrap = navWrapRef.current;
    const el = menuItemRefs.current[menuLabel];

    if (wrap && el) {
      const wrapRect = wrap.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setDropdownPos({
        left: elRect.left - wrapRect.left,
        width: elRect.width
      });
    }
  };

  const closeDropdown = () => setHoveredMenu(null);

  // =========================
  // ✅ Mobile: 클릭 시 아코디언 펼치기
  // =========================
  const onMobileTopClick = (menu) => {
    if (menu.subItems?.length) {
      // 같은 메뉴를 다시 누르면 접기
      setExpandedMobile(prev => (prev === menu.label ? null : menu.label));
      return;
    }
    navigate(menu.path);
    closeMobile();
  };

  const onMobileSubClick = (path) => {
    navigate(path);
    closeMobile();
  };

  return (
    <div className="relative">
      {/* =======================
          ✅ DESKTOP (lg 이상)
      ======================= */}
      <header className="hidden lg:block w-full bg-white">
        <div className="w-full px-8 py-6 flex items-start justify-between">
          {/* 🔹 왼쪽 영역 */}
          <div className="flex items-start gap-6">
            <div className="leading-tight">
              <div
                className="text-sm font-semibold text-black"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                2026 KUAD Graduation
              </div>
              <div
                className="text-sm font-medium text-black/80"
                style={{ fontFamily: 'Pretendard, system-ui, -apple-system, sans-serif' }}
              >
                건국대학교 의상디자인학과
              </div>
            </div>

            <Link
              to="/"
              className="text-3xl font-bold tracking-tight text-black"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              ALTER EGO
            </Link>
          </div>

          {/* 🔹 오른쪽 메뉴 */}
          <nav
            aria-label="Primary"
            ref={navWrapRef}
            className="relative"
            onMouseLeave={closeDropdown}
          >
            <ul className="flex items-center gap-10">
              {menus.map((menu) => (
                <li
                  key={menu.label}
                  ref={(el) => (menuItemRefs.current[menu.label] = el)}
                  className="relative"
                  onMouseEnter={() => openDropdown(menu.label)}
                >
                  <Link
                    to={menu.path}
                    className="text-lg font-semibold text-black hover:text-black/60 transition"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ✅ 2차 메뉴 (세로) */}
	            {hoveredMenu && menus.find(m => m.label === hoveredMenu)?.subItems?.length > 0 && (
	              <div className="absolute left-0 top-full w-full z-50">
	                <div className="relative mt-3">
	                  <div
	                    className="absolute top-0 min-w-[140px] rounded-md border border-black/15 bg-white/95 backdrop-blur-sm shadow-lg px-4 py-3"
	                    style={{ left: dropdownPos.left }}
	                    onMouseEnter={() => setHoveredMenu(hoveredMenu)}
	                  >
	                    <ul className="flex flex-col w-full divide-y divide-black/10">
	                      {menus
	                        .find(m => m.label === hoveredMenu)
	                        ?.subItems.map((sub) => (
	                          <li key={sub.name} className="w-full">
	                            <Link
	                              to={sub.path}
	                              className="block w-full py-2 text-sm font-semibold text-black hover:text-black/60 transition"
	                              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
	                              onClick={() => setHoveredMenu(null)}
	                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* =======================
          ✅ MOBILE (lg 미만)
          ✅ 이미지처럼: 1차 클릭 → 같은 패널에서 2차가 아래로 펼쳐짐
      ======================= */}
      <div className="lg:hidden">
        <div className="sticky top-0 left-0 right-0 z-50 bg-white">
          <div className="relative px-4 py-4">
            {/* 가운데 타이틀 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link
                to="/"
                className="text-xl font-bold text-black"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                ALTER EGO
              </Link>
            </div>

            <div className="flex items-center justify-between">
              {/* 좌측 작은 텍스트 */}
              <div className="leading-tight">
                <div
                  className="text-xs font-semibold text-black"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                >
                  건국대학교
                </div>
                <div
                  className="text-xs font-medium text-black/80"
                  style={{ fontFamily: 'Pretendard, system-ui, -apple-system, sans-serif' }}
                >
                  의상디자인학과
                </div>
              </div>

              {/* 우측 버튼 */}
              <div className="flex items-center gap-3">
                <button onClick={() => { setIsMobileOpen(o => !o); setExpandedMobile(null); }}>
                  {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 백드롭 */}
        {isMobileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={closeMobile} />
        )}

        {/* ✅ 모바일 메뉴 패널 */}
        <div
          className={`
            fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 border-b border-black/20
            transform transition-transform duration-300 
            ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="pt-20 px-6 pb-20 overflow-y-auto h-full relative">
            <button className="absolute top-4 right-4" onClick={closeMobile}>
              <X size={24} />
            </button>

            <ul className="space-y-10">
              {menus.map((menu) => {
                const isOpen = expandedMobile === menu.label;
                const hasSub = !!menu.subItems?.length;

                return (
                  <li key={menu.label}>
                    {/* 1차 */}
                    <button
                      className="w-full text-left text-2xl font-semibold uppercase"
                      onClick={() => onMobileTopClick(menu)}
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                    >
                      {menu.label}
                    </button>

                    {/* ✅ 2차 (아코디언) */}
                    {hasSub && (
                      <div
                        className={`
                              grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out
                              ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}
                            `}
                      >
                        <div className="overflow-hidden">
                          <ul className="space-y-6 pl-8">
                            {menu.subItems.map((sub) => (
                              <li key={sub.name}>
                                <button
                                  className="text-base font-semibold tracking-wide text-black/90"
                                  style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                                  onClick={() => onMobileSubClick(sub.path)}
                                >
                                  {sub.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                    )}
                  </li>
                );
              })}
            </ul>

            {/* 하단 SNS 링크 (원하면 유지) */}
            <div className="absolute bottom-6 left-6 flex space-x-4">
              <a href="https://www.instagram.com/kuad_archive/" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com/@kuappareldesign" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
