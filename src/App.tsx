import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/auth/PrivateRoute';

// Componentes Globais
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Páginas
import { Home } from './pages/Home'; // <--- Importando a Home nova
import { ProductDetail } from './pages/ProductDetail';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Checkout } from './pages/Checkout';
import { Success } from './pages/Success';
import { CategoryPage } from './pages/CategoryPage';
import { Login } from './pages/auth/Login';
import { CartSidebar } from './components/layout/CartSidebar';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar fixa no topo */}
      <Navbar /> 
      <CartSidebar />
      
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/categoria/:slug" element={<CategoryPage />}/>

        <Route path="/produto/:slug" element={<ProductDetail />} />

        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />

        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sucesso" element={<Success />} />
        
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* Footer no final de tudo */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;