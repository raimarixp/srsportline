import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, Flame, Zap } from 'lucide-react';
import { Hero } from '../components/layout/Hero';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { BrandStrip } from '../components/layout/BrandStrip';
import { Lookbook } from '../components/layout/LookBook'; // <--- Importe Aqui

export const Home = () => {
  const { products, loading } = useProducts(); 
  const navigate = useNavigate();

  // Filtra apenas 8 produtos para não poluir a home
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 1. HERO SECTION (Carrossel Impactante) */}
      <Hero />

      {/* 2. FAIXA DE MARCAS (Esteira Infinita) */}
      <BrandStrip />

      <div className="max-w-7xl mx-auto px-6 pb-20 space-y-24 pt-10">
        
        {/* 3. CATEGORIAS (Estilo Bento Grid) */}
        <section>
          <div className="flex items-end justify-between mb-8">
             <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
               <Trophy className="text-brand-blue" /> Coleções de Elite
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
            
            {/* Card Grande: NBA (Esquerda) */}
            <div 
              onClick={() => navigate('/categoria/nba')}
              className="md:col-span-2 relative group overflow-hidden rounded-3xl cursor-pointer shadow-lg"
            >
               <img 
                 src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop" 
                 alt="NBA Collection"
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               {/* Overlay Escuro para garantir leitura do texto branco */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
               
               <div className="absolute bottom-0 left-0 p-8">
                 <h3 className="text-4xl font-black text-white mb-2 italic">NBA ZONE</h3>
                 <p className="text-gray-200 max-w-sm font-medium">Jerseys autênticas, shorts e acessórios das maiores lendas do basquete.</p>
                 <button className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-slate-200 transition-all shadow-lg">
                   VER COLEÇÃO
                 </button>
               </div>
            </div>

            {/* Coluna Direita: Futebol e Sneakers */}
            <div className="grid grid-rows-2 gap-6">
               {/* Futebol */}
               <div 
                 onClick={() => navigate('/categoria/futebol')}
                 className="relative group overflow-hidden rounded-3xl cursor-pointer shadow-lg"
               >
                 <img 
                   src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1931&auto=format&fit=crop" 
                   alt="Futebol"
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                 <div className="absolute bottom-6 left-6">
                   <h3 className="text-2xl font-bold text-white drop-shadow-md">Futebol Europeu</h3>
                 </div>
               </div>

               {/* Sneakers */}
               <div 
                 onClick={() => navigate('/categoria/tenis')}
                 className="relative group overflow-hidden rounded-3xl cursor-pointer shadow-lg"
               >
                 <img 
                   src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop" 
                   alt="Sneakers"
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                 <div className="absolute bottom-6 left-6">
                   <h3 className="text-2xl font-bold text-white drop-shadow-md">Sneakers Hype</h3>
                 </div>
               </div>
            </div>

          </div>
        </section>


        {/* 4. LANÇAMENTOS (Grid de Produtos) */}
        <section>
          <div className="flex justify-between items-end mb-10">
              <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="text-brand-red" size={20} />
                    <span className="text-brand-red font-bold text-sm tracking-widest uppercase">Em Alta</span>
                  </div>
                  {/* Texto Escuro agora */}
                  <h2 className="text-4xl font-bold text-slate-900">Destaques da Semana</h2>
              </div>
              <button className="text-sm text-slate-500 hover:text-brand-blue flex items-center gap-2 transition-colors font-medium">
                Ver catálogo completo <ArrowRight size={16} />
              </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-slate-200 h-96 rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => navigate(`/produto/${product.slug}`)} 
                  className="cursor-pointer transition-transform hover:-translate-y-2 duration-300"
                > 
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
        </div>

        <Lookbook />

      {/* Container volta para centralizar o Banner Newsletter */}
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-20">

        {/* 5. BANNER NEWSLETTER (Claro com contraste) */}
        <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-12 text-center shadow-xl shadow-slate-200/50">
           {/* Fundo decorativo sutil */}
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-blue/5 to-brand-red/5 blur-3xl -z-10" />
           
           <Zap className="mx-auto text-brand-blue mb-4 fill-brand-blue/20" size={40} />
           
           <h2 className="text-3xl font-bold text-slate-900 mb-4">Entre para o Clube SR</h2>
           <p className="text-slate-500 max-w-lg mx-auto mb-8">
             Receba ofertas exclusivas, cupons de primeira compra e avisos de drops limitados direto no seu e-mail.
           </p>
           
           <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
             <input 
               type="email" 
               placeholder="Seu melhor e-mail" 
               className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all placeholder:text-slate-400"
             />
             <button className="bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-black transition-colors shadow-lg shadow-slate-900/20">
               INSCREVER
             </button>
           </div>
        </section>

      </div>
    </div>
  );
};