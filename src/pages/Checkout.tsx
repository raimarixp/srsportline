import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useCart } from '../context/CartContext';
import type { Product, ProductVariant } from '../types/product';
import { Lock, CreditCard, Truck, AlertCircle, ShoppingBag } from 'lucide-react';

interface ShippingOption {
  id: number;
  name: string;
  price: number;
  delivery_time: number;
  company: string;
  picture: string;
}

export const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { items: cartItems, cartTotal } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  
  // LÓGICA HÍBRIDA: Compra Direta (Botão Comprar) OU Carrinho
  const isDirectBuy = !!state?.product;
  
  const checkoutItems = isDirectBuy 
    ? [{ 
        product: state.product as Product, 
        variant: state.variant as ProductVariant, 
        quantity: 1, 
        id: 'direct' 
      }] 
    : cartItems;

  const subtotal = isDirectBuy ? state.product.price : cartTotal;

  // Se não tiver itens, volta pra home
  useEffect(() => {
    if (checkoutItems.length === 0) navigate('/');
  }, [checkoutItems, navigate]);

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  const [formData, setFormData] = useState({
    name: '', email: '', cpf: '', phone: '',
    zip_code: '', street: '', number: '', neighborhood: '', city: '', state: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚚 CÁLCULO DE FRETE
  const handleCalculateShipping = async () => {
    const cep = formData.zip_code.replace(/\D/g, '');
    if (cep.length !== 8) {
      alert("Digite um CEP válido (8 números).");
      return;
    }

    setCalculatingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      const functions = getFunctions();
      const calculateShippingParams = httpsCallable(functions, 'calculateShipping');

      // Para cálculo de frete, pegamos o primeiro item como referência ou somamos pesos (simplificado aqui)
      const firstItem = checkoutItems[0]; 
      
      const response = await calculateShippingParams({
        destinationZip: cep,
        items: [{ productId: firstItem.product.id, quantity: 1 }] // Simplificado para teste
      });

      // @ts-ignore
      const options = response.data as ShippingOption[];
      setShippingOptions(options);

      if (options.length === 0) alert("Nenhuma opção de frete encontrada.");

    } catch (error) {
      console.error("Erro frete:", error);
      alert("Erro ao calcular frete. Verifique o CEP.");
    } finally {
      setCalculatingShipping(false);
    }
  };

  // 💳 PAGAMENTO
  const handleFinishPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedShipping) {
      alert("Selecione uma opção de frete.");
      return;
    }

    setLoading(true);

    try {
      const functions = getFunctions();
      const createCheckout = httpsCallable(functions, 'createCheckoutSession');

      // Formata os itens para o Mercado Pago
      const formattedItems = checkoutItems.map((item: any) => ({
        productId: item.product.id,
        variantId: item.variant.sku || item.variant.size,
        title: `${item.product.name} - ${item.variant.size}`,
        quantity: item.quantity,
        unitPrice: item.product.price,
        pictureUrl: item.product.images[0]
      }));

      const response = await createCheckout({
        items: formattedItems,
        buyer: {
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone,
          address: {
            zip_code: formData.zip_code,
            street_name: formData.street,
            street_number: formData.number,
            neighborhood: formData.neighborhood,
            city: formData.city,
            federal_unit: formData.state
          }
        },
        shippingCost: selectedShipping.price
      });

      // @ts-ignore
      const url = response.data.url || response.data.sandbox_url;
      window.location.href = url;

    } catch (error) {
      console.error("Erro checkout:", error);
      alert("Erro ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = subtotal + (selectedShipping?.price || 0);

  if (checkoutItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: DADOS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Passo 1: Dados Pessoais */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6 text-slate-800 border-b border-slate-100 pb-4">
              <span className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/20">1</span>
              Dados Pessoais
            </h2>
            
            <form id="checkout-form" onSubmit={handleFinishPayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input name="name" placeholder="Nome Completo" onChange={handleChange} className="input-light" required />
               <input name="cpf" placeholder="CPF" onChange={handleChange} className="input-light" required />
               <input name="email" type="email" placeholder="E-mail" onChange={handleChange} className="input-light" required />
               <input name="phone" placeholder="Celular" onChange={handleChange} className="input-light" required />
            </form>
          </div>

          {/* Passo 2: Entrega */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
             <h2 className="text-xl font-bold flex items-center gap-3 mb-6 text-slate-800 border-b border-slate-100 pb-4">
              <span className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-blue-500/20">2</span>
              Endereço de Entrega
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-4">
               <div className="col-span-2">
                  <input name="zip_code" placeholder="CEP" onChange={handleChange} className="input-light font-medium" required />
               </div>
               <button 
                 type="button"
                 onClick={handleCalculateShipping}
                 disabled={calculatingShipping}
                 className="bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-black transition-colors disabled:opacity-50 shadow-lg shadow-slate-900/10"
               >
                 {calculatingShipping ? 'Calculando...' : 'Calcular Frete'}
               </button>
            </div>

            {/* Lista Frete */}
            {shippingOptions.length > 0 && (
              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Opções Disponíveis:</p>
                {shippingOptions.map((option) => (
                  <div 
                    key={option.id}
                    onClick={() => setSelectedShipping(option)}
                    className={`
                      p-4 rounded-lg border cursor-pointer flex justify-between items-center transition-all duration-200
                      ${selectedShipping?.id === option.id 
                        ? 'bg-white border-brand-blue shadow-md ring-1 ring-brand-blue/20' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {option.picture ? (
                        <img src={option.picture} alt="" className="h-6 w-auto mix-blend-multiply" />
                      ) : (
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                            <Truck className="text-slate-500" size={16} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-sm text-slate-800">{option.name}</p>
                        <p className="text-xs text-slate-500">Chega em até {option.delivery_time} dias úteis</p>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900">R$ {option.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-4 gap-4">
               <input name="street" placeholder="Rua / Avenida" onChange={handleChange} className="input-light col-span-3" required />
               <input name="number" placeholder="Nº" onChange={handleChange} className="input-light" required />
               <input name="neighborhood" placeholder="Bairro" onChange={handleChange} className="input-light col-span-2" required />
               <input name="city" placeholder="Cidade" onChange={handleChange} className="input-light" required />
               <input name="state" placeholder="UF" onChange={handleChange} className="input-light" required />
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: RESUMO */}
        <div>
           <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-28">
              <h3 className="font-bold text-lg mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                <ShoppingBag size={20} /> Resumo do Pedido
              </h3>
              
              {/* Lista de Itens (Com Scroll se tiver muitos) */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map((item: any) => (
                   <div key={item.id} className="flex gap-4 group">
                      <div className="w-14 h-14 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                         <img src={item.product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">{item.product.name}</p>
                         <div className="flex justify-between items-end mt-1">
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                Tam: {item.variant.size} (x{item.quantity})
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                                R$ {(item.product.price * item.quantity).toFixed(2)}
                            </span>
                         </div>
                      </div>
                   </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-4">
                 <div className="flex justify-between">
                    <span>Subtotal ({checkoutItems.length} itens)</span>
                    <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span>Frete</span>
                    <span className={selectedShipping ? 'text-slate-900 font-bold' : 'text-orange-500 text-xs font-bold bg-orange-50 px-2 py-1 rounded'}>
                        {selectedShipping ? `R$ ${selectedShipping.price.toFixed(2)}` : 'A calcular'}
                    </span>
                 </div>
                 <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-slate-100 mt-2">
                    <span>Total</span>
                    <span>R$ {totalPrice.toFixed(2)}</span>
                 </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={loading || !selectedShipping}
                className={`
                  w-full font-bold py-4 rounded-xl mt-8 shadow-lg transition-all flex items-center justify-center gap-2 text-sm
                  ${loading || !selectedShipping 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20 hover:-translate-y-1'
                  }
                `}
              >
                {loading ? 'Processando...' : <><Lock size={16} /> PAGAR COM MERCADO PAGO</>}
              </button>
              
              {!selectedShipping && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-orange-500 font-medium animate-pulse">
                  <AlertCircle size={14} /> Calcule o frete para finalizar
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-2 text-slate-400">
                 <div className="flex items-center gap-2 text-xs">
                    <CreditCard size={14} />
                    <span>Ambiente 100% Seguro</span>
                 </div>
                 <div className="flex gap-2 opacity-50 grayscale">
                    {/* Ícones de bandeiras fictícios com CSS puro */}
                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                    <div className="w-8 h-5 bg-slate-200 rounded"></div>
                 </div>
              </div>
           </div>
        </div>

      </div>
      <style>{`
        .input-light {
          width: 100%;
          background: #fff;
          border: 1px solid #e2e8f0;
          padding: 12px;
          border-radius: 8px;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        .input-light:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};