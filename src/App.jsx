import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

import StorePage from "./pages/StorePage";
import StoreDetailPage from "./pages/StoreDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderCompletePage from "./pages/OrderCompletePage";
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminReceiptDetail from './pages/AdminReceiptDetail';

import ScrollToTop from './components/ScrollToTop';

import ComingSoon from "./pages/ComingSoon";

function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const blockedPage = <Navigate to="/opening-soon" replace />;

  return (
    <BrowserRouter basename={basePath}>
      <ScrollToTop />
      <div className="min-h-screen-dvh bg-white">
        <Header />
        <Routes>
          <Route path="/" element={blockedPage} />
          <Route path="/opening-soon" element={<ComingSoon />} />
          {/* PROJECT 카테고리 경로 */}

          {/* 쇼 인포 */}
          <Route path="/show-info" element={blockedPage} />
          
          {/* 메인 테마 */}
          <Route path="/project/" element={blockedPage} />
 
          {/* 팀 페이지 */}
          <Route path="/team/:teamId" element={blockedPage} />
          {/* 룩북 */}
          <Route path="/project/look-book" element={blockedPage} />
          {/* 런웨이 */}
          <Route path="/project/runway" element={blockedPage} />
          {/* 기존 경로 */}
          <Route path="/portfolio/:portfolioUrl" element={blockedPage} />

          {/* 스토어 관련 경로 - teamName 대신 teamId 사용 */}
          <Route path="/store" element={<Navigate to="/store/all" />} />
          <Route path="/store/all" element={<StorePage />} />
          <Route path="/store/team/:teamId" element={<StorePage />} />
          <Route path="/store/item/:itemId" element={<StoreDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-complete/:receiptId" element={<OrderCompletePage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/receipt/:id" element={<AdminReceiptDetail />} />

          {/* 비하인드 */}
          <Route path="/behind/" element={blockedPage} />
          <Route path="/behind/show" element={blockedPage} />
          <Route path="/behind/brochure" element={blockedPage} />
          <Route path="/behind/making" element={blockedPage} />
          
          {/* archive */}
          <Route path="/archive" element={blockedPage} />

          {/* 스토어 선오픈 기간에는 미공개 경로를 임시 안내 페이지로 보냅니다. */}
          <Route path="*" element={blockedPage} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
