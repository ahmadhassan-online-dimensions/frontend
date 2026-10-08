import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import AuthModal from "./components/AuthModal.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Home from "./pages/Home.jsx";
import ModelsPage from "./pages/ModelsPage.jsx";
import MaterialsPage from "./pages/MaterialsPage.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import { AdminUsers, AdminSubscribers } from "./pages/admin/AdminPeople.jsx";

// new page -> top of page; a #hash -> scroll to that section
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();

  // the admin panel has its own layout: no shop header, footer, bag or sign-in popup
  if (pathname.startsWith("/admin")) {
    return (
      <>
        <ScrollManager />
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
            <Route path="*" element={<p className="status status--left">Page not found.</p>} />
          </Route>
        </Routes>
      </>
    );
  }

  return (
    <>
      <ScrollManager />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="*" element={<div className="page"><p className="status">Page not found.</p></div>} />
        </Routes>
      </main>
      <Footer />
      <AuthModal />
      <CartDrawer />
    </>
  );
}
