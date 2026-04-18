import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

import Home from './pages/Home';

import ShowInfo from "./pages/ShowInfo";

import ProjectPage from './pages/ProjectPage';
import TeamPage from './pages/TeamPage';

import SearchPage from "./pages/SearchPage";
import StorePage from "./pages/StorePage";
import StoreDetailPage from "./pages/StoreDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderCompletePage from "./pages/OrderCompletePage";
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminReceiptDetail from './pages/AdminReceiptDetail';

import PortfolioPage from './pages/PortfolioPage';


import ScrollToTop from './components/ScrollToTop';

import LookBook from "./pages/LookBook";
// import ComingSoon from "./pages/ComingSoon";
import ArchivePage from "./pages/ArchivePage";
import BehindShow from "./pages/BehindShow";
import BehindBrochure from "./pages/BehindBrochure";
import BehindMaking from "./pages/BehindMaking";
import Runway from "./pages/Runway";

function App() {
  return (
    <BrowserRouter basename="/2026">
      <ScrollToTop />
      <div className="min-h-screen-dvh bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* PROJECT 카테고리 경로 */}

          {/* 쇼 인포 */}
          <Route path="/show-info" element={<ShowInfo />} />
          
          {/* 메인 테마 */}
          <Route path="/project/" element={<ProjectPage />} />
 
          {/* 팀 페이지 */}
          <Route path="/team/:teamId" element={<TeamPage />} />
          {/* 룩북 */}
          <Route path="/project/look-book" element={<LookBook />} />
          {/* 런웨이 */}
          <Route path="/project/runway" element={<Runway />} />
          {/* 기존 경로 */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/portfolio/:portfolioUrl" element={<PortfolioPage />} />

          {/* 스토어 관련 경로 - teamName 대신 teamId 사용 */}
          <Route path="/store" element={<Navigate to="/store/all" />} />
          <Route path="/store/all" element={<StorePage />} />
          <Route path="/store/team/:teamId" element={<StorePage />} />
          <Route path="/store/item/:itemId" element={<StoreDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-complete/:receiptId" element={<OrderCompletePage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/receipt/:id" element={<AdminReceiptDetail />} />

          {/* 비하인드 */}
          <Route path="/behind/" element={<Navigate to="/behind/show" />} />
          <Route path="/behind/show" element={<BehindShow />} />
          <Route path="/behind/brochure" element={<BehindBrochure />} />
          <Route path="/behind/making" element={<BehindMaking />} />
          
          {/* archive */}
          <Route path="/archive" element={<ArchivePage />} />

          {/* 404 페이지 */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="mt-20 text-center">
                <h1 className="text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
                <p className="mb-8">요청하신 페이지가 존재하지 않습니다.</p>
                <a href="/2026/" className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition">
                  홈으로 돌아가기
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
