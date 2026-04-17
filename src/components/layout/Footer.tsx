import { Instagram, Twitter, Facebook, CreditCard, Truck, ShieldCheck, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. SEÇÃO DE CONFIANÇA (Ícones) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="p-4 rounded-full bg-white/5 group-hover:bg-brand-blue/20 transition-colors">
              <Truck size={32} className="text-white group-hover:text-brand-blue" />
            </div>
            <h3 className="text-white font-bold">Frete para todo Brasil</h3>
            <p className="text-sm">Envio rastreado e seguro via Correios.</p>
          </div>
          
          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="p-4 rounded-full bg-white/5 group-hover:bg-brand-blue/20 transition-colors">
              <CreditCard size={32} className="text-white group-hover:text-brand-blue" />
            </div>
            <h3 className="text-white font-bold">Até 12x no Cartão</h3>
            <p className="text-sm">Parcelamento facilitado ou Pix com desconto.</p>
          </div>

          <div className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="p-4 rounded-full bg-white/5 group-hover:bg-brand-blue/20 transition-colors">
              <ShieldCheck size={32} className="text-white group-hover:text-brand-blue" />
            </div>
            <h3 className="text-white font-bold">Compra 100% Segura</h3>
            <p className="text-sm">Seus dados protegidos com criptografia.</p>
          </div>
        </div>

        <div className="h-px bg-white/10 mb-12" />

        {/* 2. LINKS E INFORMAÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Coluna 1: Marca */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic text-white flex gap-1">
              VX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-red">SPORTLINE</span>
            </h2>
            <p className="text-sm leading-relaxed">
              Especialistas em artigos esportivos importados. Trazendo a elite do basquete e do futebol mundial para o seu jogo.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-brand-blue transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-brand-blue transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-brand-blue transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Loja</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Lançamentos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NBA Jerseys</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Futebol Europeu</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sneakers Exclusivos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Promoções</a></li>
            </ul>
          </div>

          {/* Coluna 3: Ajuda */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Suporte</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Rastrear Pedido</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guia de Tamanhos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fale Conosco</a></li>
            </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Atendimento</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-blue" />
                suporte@vortexsports.com
              </li>
              <li className="text-xs text-gray-500">
                Seg a Sex: 09h às 18h<br />
                Sáb: 09h às 13h
              </li>
            </ul>
          </div>
        </div>

        {/* 3. RODAPÉ FINAL */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>© 2024 Vortex sports. Todos os direitos reservados.</p>
          <div className="flex gap-4">
             {/* Simulação de ícones de pagamento */}
             <div className="h-6 w-10 bg-white/10 rounded"></div>
             <div className="h-6 w-10 bg-white/10 rounded"></div>
             <div className="h-6 w-10 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};