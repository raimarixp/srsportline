import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // <--- Importando Carrinho

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount, setIsCartOpen } = useCart(); // <--- Usando Carrinho
  const navigate = useNavigate();

  // Detecta rolagem para mudar a cor da navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cores dinâmicas baseadas no scroll
  const navBg = scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-slate-100' : 'bg-transparent';
  const textColor = scrolled ? 'text-slate-900' : 'text-white';
  const logoColor = scrolled ? 'text-slate-900' : 'text-white drop-shadow-md';
  const iconHover = scrolled ? 'hover:text-brand-blue' : 'hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBg} py-4`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO (Com contraste ajustado) */}
        <Link to="/" className="text-2xl font-black tracking-tighter italic flex items-center gap-1 group">
          {/* SR agora muda de cor e tem sombra no modo transparente */}
          <span className={`${logoColor} transition-colors duration-300`}>SR</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400 font-extrabold filter drop-shadow-sm">
            SPORTLINE
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <div className={`hidden md:flex items-center gap-8 text-sm font-bold tracking-wide transition-colors ${textColor}`}>
          <Link to="/" className={`transition-all duration-300 hover:-translate-y-0.5 ${iconHover}`}>INÍCIO</Link>
          <Link to="/categoria/nba" className={`transition-all duration-300 hover:-translate-y-0.5 ${iconHover}`}>NBA</Link>
          <Link to="/categoria/futebol" className={`transition-all duration-300 hover:-translate-y-0.5 ${iconHover}`}>FUTEBOL</Link>
          <Link to="/categoria/tenis" className={`transition-all duration-300 hover:-translate-y-0.5 ${iconHover}`}>SNEAKERS</Link>
        </div>

        {/* ÍCONES E AÇÕES */}
        <div className={`flex items-center gap-5 transition-colors ${textColor}`}>
           
           {/* Botão Admin (Apenas para admins) */}
           {isAdmin && (
             <button 
               onClick={() => navigate('/admin')} 
               className={`
                 hidden md:flex text-[10px] font-bold px-3 py-1.5 rounded-full transition-all uppercase tracking-wider border
                 ${scrolled 
                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-black' 
                    : 'bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-md'
                 }
               `}
             >
               PAINEL ADMIN
             </button>
           )}

          {/* Carrinho (Com contador real) */}
          <button 
            className={`relative group transition-transform hover:scale-110 ${iconHover}`}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
               <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                 {cartCount}
               </span>
            )}
          </button>
          
          {/* Usuário / Login */}
          {user ? (
            <div className="hidden md:flex items-center gap-2 cursor-pointer group relative">
                <User className={`w-6 h-6 transition-transform hover:scale-110 ${iconHover}`} />
                {/* Menu Dropdown Simples ao passar o mouse (Opcional) */}
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-xl py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 transform origin-top-right">
                    <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold">
                        Sair
                    </button>
                </div>
            </div>
          ) : (
            <Link to="/login" className={`hidden md:flex items-center gap-1 font-bold text-sm transition-all hover:scale-105 ${iconHover}`}>
                <LogIn className="w-5 h-5" /> 
                <span className="hidden lg:inline">ENTRAR</span>
            </Link>
          )}

          {/* Menu Mobile Hamburguer */}
          <button 
            className={`md:hidden transition-transform active:scale-90 ${iconHover}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (Gaveta) */}
      <div className={`
          absolute top-full left-0 w-full bg-white border-t border-slate-100 p-6 flex flex-col gap-4 md:hidden shadow-2xl transition-all duration-300 origin-top
          ${mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}
      `}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-slate-800 hover:text-brand-blue">INÍCIO</Link>
          <Link to="/categoria/nba" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-600 hover:text-brand-blue">NBA</Link>
          <Link to="/categoria/futebol" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-600 hover:text-brand-blue">FUTEBOL</Link>
          <Link to="/categoria/tenis" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-slate-600 hover:text-brand-blue">SNEAKERS</Link>
          
          <div className="h-px bg-slate-100 my-2"></div>
          
          {user ? (
             <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-red-600 font-bold text-left">SAIR DA CONTA</button>
          ) : (
             <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-brand-blue font-bold flex items-center gap-2">
                <LogIn size={20} /> ENTRAR / CADASTRAR
             </Link>
          )}
      </div>
    </nav>
  );
};