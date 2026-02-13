import { useCart } from '../../context/CartContext';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartSidebar = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Overlay Escuro */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />

      {/* Painel Lateral */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 flex flex-col">
        
        {/* Cabeçalho */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="text-brand-blue" /> Sua Sacola ({items.length})
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Lista de Produtos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag size={64} className="text-slate-200" />
              <p className="text-slate-500 font-medium">Sua sacola está vazia.</p>
              <button onClick={() => setIsCartOpen(false)} className="text-brand-blue font-bold hover:underline">
                Continuar comprando
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{item.product.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">Tamanho: {item.variant.size}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 px-2 hover:bg-slate-100 text-slate-600"><Minus size={14} /></button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 px-2 hover:bg-slate-100 text-slate-600"><Plus size={14} /></button>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-slate-900">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                       <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-red-500 hover:text-red-700 flex items-center justify-end gap-1 mt-1">
                         Remover <Trash2 size={10} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé (Total + Checkout) */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-xl font-black text-slate-900">R$ {cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout'); // Vai para o checkout com todos os itens
              }}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2"
            >
              FINALIZAR COMPRA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};