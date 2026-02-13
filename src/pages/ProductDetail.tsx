import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { db } from '../services/firebase/config';
import type { Product, ProductVariant } from '../types/product';
import { ShoppingCart, ShieldCheck, Truck, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext'; // <--- Importando o Carrinho

export const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // <--- Usando o Hook do Carrinho

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false); // Estado para animação do botão

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data() as Product;
          setProduct({ ...docData, id: querySnapshot.docs[0].id });
        } else {
            console.log("Produto não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
        fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center bg-slate-50">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 text-center text-slate-500 bg-slate-50">
        <p>Produto não encontrado.</p>
        <button onClick={() => navigate('/')} className="text-brand-blue underline mt-2">Voltar para a loja</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    setIsAdding(true);
    addToCart(product, selectedVariant);
    
    // Pequeno delay para feedback visual antes de resetar o botão
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 font-medium">
            <span className="hover:text-brand-blue cursor-pointer transition-colors" onClick={() => navigate('/')}>Início</span>
            <ChevronRight size={14} />
            <span 
              className="capitalize text-slate-500 hover:text-brand-blue cursor-pointer transition-colors"
              onClick={() => navigate(`/categoria/${product.category.toLowerCase()}`)}
            >
              {product.category}
            </span>
            <ChevronRight size={14} />
            <span className="text-slate-800 truncate max-w-[200px] font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* GALERIA DE IMAGENS */}
          <div className="space-y-6 sticky top-28 h-fit">
             <div className="aspect-square w-full bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 relative group cursor-zoom-in">
               <img 
                 src={product.images[0]} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 origin-center" 
                 alt={product.name}
               />
               <div className="absolute inset-0 pointer-events-none ring-1 ring-black/5 rounded-3xl"></div>
             </div>
             
             {/* Miniaturas (Placeholder para futuro carrossel) */}
             {product.images.length > 1 && (
               <div className="flex gap-4 overflow-x-auto pb-2">
                 {product.images.map((img, idx) => (
                   <div key={idx} className={`w-20 h-20 rounded-xl border-2 cursor-pointer overflow-hidden ${idx === 0 ? 'border-brand-blue' : 'border-transparent'}`}>
                      <img src={img} className="w-full h-full object-cover" alt="" />
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* INFORMAÇÕES DO PRODUTO */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded uppercase tracking-wider">{product.brand}</span>
                 {product.team && <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded uppercase tracking-wider">{product.team}</span>}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-4 tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-4 mb-3">
                 <span className="text-4xl font-bold text-slate-900 tracking-tight">
                   R$ {product.price.toFixed(2)}
                 </span>
                 {product.compare_at_price && (
                   <span className="text-xl text-slate-400 line-through mb-1 font-medium">
                     R$ {product.compare_at_price.toFixed(2)}
                   </span>
                 )}
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 text-xs font-bold uppercase tracking-wide">Em Estoque</span>
                 </div>
                 <span className="text-xs text-slate-400 font-medium">
                    12x de R$ {(product.price / 12).toFixed(2)} sem juros
                 </span>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            {/* SELEÇÃO DE TAMANHO */}
            <div>
               <div className="flex justify-between items-center mb-4">
                 <label className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                    Tamanho
                    {selectedVariant && <span className="text-slate-400 font-normal normal-case">- {selectedVariant.size}</span>}
                 </label>
                 <span className="text-xs text-brand-blue font-bold underline cursor-pointer hover:text-blue-700 transition-colors">Guia de medidas</span>
               </div>
               
               <div className="flex flex-wrap gap-3">
                 {product.variants.map((variant) => (
                   <button
                     key={variant.size}
                     onClick={() => setSelectedVariant(variant)}
                     disabled={variant.stock === 0}
                     className={`
                       h-14 min-w-[3.5rem] px-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 relative
                       ${variant.stock === 0 
                         ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50 decoration-slate-300 line-through' 
                         : selectedVariant?.size === variant.size
                            ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                            : 'border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900 bg-white'
                       }
                     `}
                   >
                     {variant.size}
                     {/* Badge de "Poucas unidades" se estoque for baixo */}
                     {variant.stock > 0 && variant.stock < 3 && (
                        <span className="absolute -top-2 -right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                     )}
                   </button>
                 ))}
               </div>
               {!selectedVariant && (
                  <p className="text-xs text-red-500 mt-2 font-medium animate-pulse hidden">Por favor, selecione um tamanho.</p>
               )}
            </div>

            {/* BOTÃO COMPRAR / ADICIONAR */}
            <div className="space-y-3">
                <button 
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || isAdding}
                  className={`
                    w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300
                    ${selectedVariant 
                      ? isAdding 
                          ? 'bg-green-600 text-white scale-[0.98]'
                          : 'bg-brand-blue text-white hover:bg-blue-700 hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-blue-900/20' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isAdding ? (
                      <><Check size={24} className="animate-bounce" /> ADICIONADO!</>
                  ) : (
                      <><ShoppingCart size={22} /> {selectedVariant ? 'ADICIONAR À SACOLA' : 'SELECIONE UM TAMANHO'}</>
                  )}
                </button>
                
                {/* Botão Secundário: Compra Rápida (Opcional, levaria direto pro checkout) */}
                {/* <button className="...">Comprar Agora</button> */}
            </div>

            {/* BENEFÍCIOS (ÍCONES) */}
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
               <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue">
                     <Truck size={16} /> 
                  </div>
                  <span>Envio Rápido para todo Brasil</span>
               </div>
               <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                     <ShieldCheck size={16} /> 
                  </div>
                  <span>Garantia de Originalidade</span>
               </div>
            </div>

            {/* DESCRIÇÃO / DETALHES */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">Detalhes do Produto</h3>
               <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                 {product.description}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};