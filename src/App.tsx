import { Route, Routes } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import RequireAdmin from '@/components/admin/RequireAdmin';
import AdminLayout from '@/components/admin/AdminLayout';
import AboutPage from '@/pages/AboutPage';
import CatalogPage from '@/pages/CatalogPage';
import ContactPage from '@/pages/ContactPage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import LoginPage from '@/pages/admin/LoginPage';
import ProductFormPage from '@/pages/admin/ProductFormPage';
import ProductsPage from '@/pages/admin/ProductsPage';
import SiteImagesPage from '@/pages/admin/SiteImagesPage';

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="sobre" element={<AboutPage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="produto/:id" element={<ProductDetailPage />} />
        <Route path="contato" element={<ContactPage />} />
      </Route>

      <Route path="admin/login" element={<LoginPage />} />
      <Route path="admin" element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="produtos" element={<ProductsPage />} />
          <Route path="produtos/novo" element={<ProductFormPage />} />
          <Route path="produtos/:id/editar" element={<ProductFormPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="imagens" element={<SiteImagesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
