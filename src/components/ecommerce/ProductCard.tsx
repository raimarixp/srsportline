import type { Product } from '../../types/product';
import { ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const price = product.price;
  const oldPrice = product.compare_at_price;
  const isOnSale = oldPrice && oldPrice > price;

  return (
    <div className="group relative h-full flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 border border-slate-200 shadow-md hover:shadow-2xl hover:border-brand-blue/40 hover:-translate-y-2">
      
      {/* Container da Imagem */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        
        {/* Badge de Oferta */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {isOnSale && (
            <span className="bg-brand-red text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
              Oferta
            </span>
          )}
          {product.featured && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
              Destaque
            </span>
          )}
        </div>

        <img 
          src={product.images[0]} 
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay Escuro Suave no Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {/* Botão Rápido (Sobe ao passar o mouse) */}
        <div className="absolute inset-x-4 bottom-4 translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-brand-blue transition-colors">
            <ShoppingCart size={16} /> <span className="text-xs uppercase tracking-wide">Comprar</span>
          </button>
        </div>
      </div>

      {/* Informações do Produto */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
           <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold bg-slate-100 px-2 py-0.5 rounded">
             {product.category}
           </p>
           {/* Avaliação Fake para estética */}
           <div className="flex gap-0.5">
             <Star size={10} className="fill-yellow-400 text-yellow-400" />
             <span className="text-[10px] text-slate-400 font-medium ml-1">4.9</span>
           </div>
        </div>
        
        <h3 className="text-sm font-bold text-slate-800 leading-snug mb-3 group-hover:text-brand-blue transition-colors line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>

        <div className="mt-auto pt-3 border-t border-slate-50">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">
              R$ {price.toFixed(2)}
            </span>
            {isOnSale && (
              <span className="text-xs text-slate-400 line-through decoration-slate-400">
                R$ {oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <p className="text-[10px] text-brand-blue font-medium mt-0.5 flex items-center gap-1">
             12x de R$ {(price/12).toFixed(2)} <span className="text-slate-400 font-normal">sem juros</span>
          </p>
        </div>
      </div>
    </div>
  );
};