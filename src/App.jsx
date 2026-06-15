import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ShowInfo from "./pages/ShowInfo";
import MainTheme from "./pages/MainTheme";
import TeamPage from "./pages/TeamPage";
import LookBook from "./pages/LookBook";
import Runway from "./pages/Runway";
import PortfolioPage from "./pages/PortfolioPage";
import BehindShow from "./pages/BehindShow";
import BehindBrochure from "./pages/BehindBrochure";
import BehindMaking from "./pages/BehindMaking";
import ArchivePage from "./pages/ArchivePage";

import ScrollToTop from './components/ScrollToTop';

import ComingSoon from "./pages/ComingSoon";
import { STORE_ONLY_MODE } from "./config/siteMode";

function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const blockedPage = <Navigate to="/opening-soon" replace />;
  const gatePage = (page) => (STORE_ONLY_MODE ? blockedPage : page);

  return (
    <BrowserRouter basename={basePath}>
      <ScrollToTop />
      <div className="min-h-screen-dvh bg-white">
        <Header />
        <Routes>
          <Route path="/" element={gatePage(<Home />)} />
          <Route path="/opening-soon" element={<ComingSoon />} />
          <Route path="/show-info" element={gatePage(<ShowInfo />)} />
          <Route path="/project/" element={gatePage(<MainTheme />)} />
          <Route path="/team/:teamId" element={gatePage(<TeamPage />)} />
          <Route path="/project/look-book" element={gatePage(<LookBook />)} />
          <Route path="/project/runway" element={gatePage(<Runway />)} />
          <Route path="/portfolio/:portfolioUrl" element={gatePage(<PortfolioPage />)} />

          <Route path="/store" element={blockedPage} />
          <Route path="/store/all" element={blockedPage} />
          <Route path="/store/team/:teamId" element={blockedPage} />
          <Route path="/store/item/:itemId" element={blockedPage} />
          <Route path="/checkout" element={blockedPage} />
          <Route path="/order-complete/:receiptId" element={blockedPage} />
          <Route path="/admin" element={blockedPage} />
          <Route path="/admin/dashboard" element={blockedPage} />
          <Route path="/admin/receipt/:id" element={blockedPage} />

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
