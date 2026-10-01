import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import ScrollToTop from './components/ScrollToTop';
import StoreClosed from "./pages/StoreClosed";
import { useSiteLocked } from "./config/siteMode";

const pageLoaders = {
  ShowInfo: () => import("./pages/ShowInfo"),
  ProjectPage: () => import("./pages/ProjectPage"),
  TeamPage: () => import("./pages/TeamPage"),
  LookBook: () => import("./pages/LookBook"),
  Runway: () => import("./pages/Runway"),
  PortfolioPage: () => import("./pages/PortfolioPage"),
  BehindShow: () => import("./pages/BehindShow"),
  ArchivePage: () => import("./pages/ArchivePage"),
  AdminLogin: () => import("./pages/AdminLogin"),
  AdminDashboard: () => import("./pages/AdminDashboard"),
  AdminReceiptDetail: () => import("./pages/AdminReceiptDetail"),
};
const lazyPages = Object.fromEntries(Object.entries(pageLoaders).map(([name, load]) => [name, lazy(load)]));

export async function loadPublicPages() {
  const loaded = await Promise.all(Object.entries(pageLoaders)
    .filter(([name]) => !name.startsWith("Admin"))
    .map(async ([name, load]) => [name, (await load()).default]));
  return { ...lazyPages, ...Object.fromEntries(loaded) };
}

function App({ Router = BrowserRouter, routerProps = {}, pages = lazyPages }) {
  const { ShowInfo, ProjectPage, TeamPage, LookBook, Runway, PortfolioPage, BehindShow, ArchivePage, AdminLogin, AdminDashboard, AdminReceiptDetail } = pages;
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const siteLocked = useSiteLocked();
  const blockedPage = <Navigate to="/store-closed" replace />;
  const gatePage = (page) => (siteLocked ? blockedPage : page);
  const storeClosedPage = <StoreClosed />;

  return (
    <Router basename={basePath} {...routerProps}>
      <ScrollToTop />
      <div className="min-h-screen-dvh bg-white">
        <Header />
        <Suspense fallback={null}>
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
            <Route path="/behind/show" element={<Navigate to="/behind/" replace />} />
            <Route path="/behind/brochure" element={<Navigate to="/behind/" replace />} />
            <Route path="/behind/making" element={<Navigate to="/behind/" replace />} />
            <Route path="/archive" element={gatePage(<ArchivePage />)} />

            <Route path="*" element={blockedPage} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
