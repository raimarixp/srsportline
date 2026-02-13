import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id'); // O Mercado Pago manda isso na URL

  // Opcional: Limpar o carrinho aqui se estivesse usando Context
  useEffect(() => {
    // Efeito de confete ou som poderia vir aqui
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel p-8 text-center space-y-6">
        
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500 shadow-neon-green">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
          Pedido Confirmado!
        </h1>

        <p className="text-gray-300">
          Obrigado pela compra. Seu pagamento foi processado com sucesso.
        </p>

        {paymentId && (
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Código do Pedido</p>
            <p className="font-mono text-lg font-bold text-brand-blue">#{paymentId}</p>
          </div>
        )}

        <div className="pt-4 space-y-3">
          <p className="text-sm text-gray-400">
            Você receberá um e-mail com os detalhes do rastreio assim que enviarmos.
          </p>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all"
          >
            Voltar para a Loja
          </button>
        </div>

      </div>
    </div>
  );
};