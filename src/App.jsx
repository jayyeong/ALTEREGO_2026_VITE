import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ShowInfo from "./pages/ShowInfo";
import ProjectPage from "./pages/ProjectPage";
import TeamPage from "./pages/TeamPage";
import LookBook from "./pages/LookBook";
import Runway from "./pages/Runway";
import PortfolioPage from "./pages/PortfolioPage";
import BehindShow from "./pages/BehindShow";
import BehindBrochure from "./pages/BehindBrochure";
import BehindMaking from "./pages/BehindMaking";
import ArchivePage from "./pages/ArchivePage";

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminReceiptDetail from './pages/AdminReceiptDetail';

import ScrollToTop from './components/ScrollToTop';

import StoreClosed from "./pages/StoreClosed";
import { useSiteLocked } from "./config/siteMode";

function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const siteLocked = useSiteLocked();
  const blockedPage = <Navigate to="/store-closed" replace />;
  const gatePage = (page) => (siteLocked ? blockedPage : page);
  const storeClosedPage = <StoreClosed />;

  return (
    <BrowserRouter basename={basePath}>
      <ScrollToTop />
      <div className="min-h-screen-dvh bg-white">
        <Header />
        <Routes>
          <Route path="/" element={gatePage(<Home />)} />
          <Route path="/opening-soon" element={<Navigate to="/store-closed" replace />} />
          <Route path="/store-closed" element={storeClosedPage} />
          <Route path="/show-info" element={gatePage(<ShowInfo />)} />
          <Route path="/project/" element={gatePage(<ProjectPage />)} />
          <Route path="/team/:teamId" element={gatePage(<TeamPage />)} />
          <Route path="/project/look-book" element={gatePage(<LookBook />)} />
          <Route path="/project/runway" element={gatePage(<Runway />)} />
          <Route path="/portfolio/:portfolioUrl" element={gatePage(<PortfolioPage />)} />

          <Route path="/store" element={storeClosedPage} />
          <Route path="/store/all" element={storeClosedPage} />
          <Route path="/store/team/:teamId" element={storeClosedPage} />
          <Route path="/store/item/:itemId" element={storeClosedPage} />
          <Route path="/checkout" element={storeClosedPage} />
          <Route path="/order-complete/:receiptId" element={storeClosedPage} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/receipt/:id" element={<AdminReceiptDetail />} />

          <Route path="/behind/" element={gatePage(<BehindShow />)} />
          <Route path="/behind/show" element={gatePage(<BehindShow />)} />
          <Route path="/behind/brochure" element={gatePage(<BehindBrochure />)} />
          <Route path="/behind/making" element={gatePage(<BehindMaking />)} />
          <Route path="/archive" element={gatePage(<ArchivePage />)} />

          <Route path="*" element={blockedPage} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
