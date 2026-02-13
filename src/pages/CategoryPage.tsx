import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase/config';
import type { Product } from '../types/product';
import { ProductCard } from '../components/ecommerce/ProductCard';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';

export const CategoryPage = () => {
  const { slug } = useParams(); // Ex: 'futebol', 'nike', 'nba'
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filtros Ativos
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Título Formatado (Primeira letra maiúscula)
  const pageTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Catálogo';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Estratégia Híbrida: Buscamos tudo e filtramos no cliente para flexibilidade
        // (Em produção com milhares de itens, faríamos queries compostas no Firebase)
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);
        
        const allProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        // Filtragem Inteligente
        const filtered = allProducts.filter(p => {
            if (!slug) return true;
            const term = slug.toLowerCase();
            
            // Verifica se o termo bate com Categoria, Marca, Liga ou Time
            return (
                p.category.toLowerCase().includes(term) ||
                p.brand.toLowerCase().includes(term) ||
                p.league?.toLowerCase().includes(term) ||
                p.team?.toLowerCase().includes(term)
            );
        });

        setProducts(filtered);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Resetar filtros ao mudar de categoria
    setSelectedSizes([]);
  }, [slug]);

  // Lógica de Filtro Local (Preço e Tamanho)
  const displayProducts = products.filter(p => {
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchSize = selectedSizes.length === 0 || p.variants.some(v => selectedSizes.includes(v.size) && v.stock > 0);
      return matchPrice && matchSize;
  });

  const toggleSize = (size: string) => {
      setSelectedSizes(prev => 
        prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
      );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      
      {/* HEADER DA CATEGORIA */}
      <div className="bg-white border-b border-slate-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2">{pageTitle}</h1>
            <p className="text-slate-500">
                {displayProducts.length} produtos encontrados
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8">
        
        {/* FILTROS (SIDEBAR) */}
        <aside className={`
            fixed inset-0 z-50 bg-white p-6 transition-transform duration-300 lg:relative lg:inset-auto lg:translate-x-0 lg:block lg:w-64 lg:p-0 lg:bg-transparent lg:shadow-none
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
                <span className="font-bold text-lg">Filtros</span>
                <button onClick={() => setShowMobileFilters(false)}><X /></button>
            </div>

            <div className="space-y-8">
                {/* Filtro de Preço */}
                <div>
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                        Preço <ChevronDown size={16} />
                    </h3>
                    <div className="px-2">
                        <input 
                            type="range" 
                            min="0" max="2000" step="50"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                            className="w-full accent-brand-blue h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                            <span>R$ 0</span>
                            <span>Até R$ {priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                {/* Filtro de Tamanho */}
                <div>
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                        Tamanho <ChevronDown size={16} />
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                        {['P', 'M', 'G', 'GG', '39', '40', '41', '42'].map(size => (
                            <button
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`
                                    h-10 rounded border text-sm font-bold transition-colors
                                    ${selectedSizes.includes(size) 
                                        ? 'bg-brand-blue text-white border-brand-blue' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-brand-blue'
                                    }
                                `}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Botão Limpar (Mobile) */}
                <button 
                    onClick={() => { setSelectedSizes([]); setPriceRange([0, 2000]); }}
                    className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 text-sm"
                >
                    Limpar Filtros
                </button>
            </div>
        </aside>

        {/* OVERLAY MOBILE */}
        {showMobileFilters && (
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)} />
        )}

        {/* GRID DE PRODUTOS */}
        <main className="flex-1">
            
            {/* Barra de Controle Mobile */}
            <div className="lg:hidden mb-6">
                <button 
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 w-full justify-center shadow-sm"
                >
                    <SlidersHorizontal size={16} /> Filtrar Produtos
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-slate-200" />
                    ))}
                </div>
            ) : displayProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {displayProducts.map(product => (
                         <div 
                           key={product.id} 
                           onClick={() => navigate(`/produto/${product.slug}`)} 
                           className="cursor-pointer transition-transform hover:-translate-y-1 duration-300"
                         > 
                            <ProductCard product={product} />
                         </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
                    <p className="text-slate-400 font-medium mb-2">Nenhum produto encontrado.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="text-brand-blue font-bold hover:underline"
                    >
                        Voltar para o início
                    </button>
                </div>
            )}
        </main>

      </div>
    </div>
  );
};