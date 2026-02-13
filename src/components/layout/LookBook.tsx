import { Instagram, ArrowRight } from 'lucide-react';

const LOOKS = [
  "https://i.ibb.co/8DGrsCT9/Save-Clip-App-277243942-2354441294693001-7188785454205562289-n.jpg",
  "https://i.ibb.co/zWvXCfcW/Save-Clip-App-377942238-280611651440372-4846178121153684607-n.jpg",
  "https://i.ibb.co/5hfPRvSW/Save-Clip-App-608767834-18523992613069239-7058255806420104862-n.jpg",
  "https://i.ibb.co/twN1F8dF/Save-Clip-App-608784603-18523992595069239-2028127990901838615-n.jpg",
  "https://i.ibb.co/k64g6Jnz/Save-Clip-App-451399006-1951456538607974-2188696719384486105-n.jpg",
  "https://i.ibb.co/YBjwTDqh/Save-Clip-App-607796419-18523992625069239-8176579895523637158-n.jpg",
  "https://i.ibb.co/67kLpj3d/Save-Clip-App-313028804-422431463416528-194857227793726585-n.jpg"
];

export const Lookbook = () => {
  return (
    // MUDANÇA 1: bg-white -> bg-slate-50 (Menos brilho no olho)
    <section className="py-20 bg-slate-50 border-y border-slate-200 overflow-hidden">
      
      {/* Cabeçalho */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span className="text-brand-blue font-bold tracking-widest text-xs uppercase mb-2 block">
            #SRSPORTLINE
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            LOOKBOOK <span className="text-slate-400 italic">2026</span>
          </h2>
          <p className="text-slate-500 mt-2 max-w-md">
            Inspiração real. Veja como nossa comunidade usa as peças exclusivas no dia a dia.
          </p>
        </div>
        
        <button className="group flex items-center gap-2 text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-brand-blue hover:border-brand-blue transition-all">
          <Instagram size={18} /> SIGA NO INSTAGRAM
        </button>
      </div>

      {/* ESTEIRA INFINITA */}
      <div className="relative w-full flex overflow-hidden group space-x-4">
        
        {/* MUDANÇA 2: Máscaras de Gradiente Suavizadas 
            - Reduzi w-24 para w-12 md:w-20 (menos invasivo)
            - Mudei from-white para from-slate-50/90 (combina com o fundo e é menos "branco puro")
        */}
        <div className="absolute top-0 left-0 h-full w-12 md:w-20 bg-gradient-to-r from-slate-50/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 h-full w-12 md:w-20 bg-gradient-to-l from-slate-50/90 to-transparent z-10 pointer-events-none" />

        {/* LISTA 1 */}
        {/* MUDANÇA 3: Performance
            - Adicionei 'transform-gpu': Força o navegador a usar a placa de vídeo
            - Adicionei 'will-change-transform': Avisa o navegador para otimizar essa div
        */}
        <div className="flex items-center space-x-4 animate-infinite-scroll-reverse group-hover:paused transform-gpu will-change-transform">
          {[...LOOKS, ...LOOKS, ...LOOKS].map((img, i) => (
             <LookbookCard key={`a-${i}`} img={img} index={i} />
          ))}
        </div>

        {/* LISTA 2 (Cópia para o Loop) */}
        <div className="flex items-center space-x-4 animate-infinite-scroll-reverse group-hover:paused transform-gpu will-change-transform" aria-hidden="true">
          {[...LOOKS, ...LOOKS, ...LOOKS].map((img, i) => (
             <LookbookCard key={`b-${i}`} img={img} index={i} />
          ))}
        </div>

      </div>
      
      <style>{`
        .paused { animation-play-state: paused; }
        .group:hover .group-hover\\:paused { animation-play-state: paused; }
      `}</style>
    </section>
  );
};

const LookbookCard = ({ img }: { img: string, index: number }) => (
  // Mantido w-[200px] md:w-[375px] e aspect-[2/3] como solicitado
  <div className="relative w-[200px] md:w-[375px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 shrink-0">
    {/* Adicionado 'decoding="async"' para ajudar na performance de renderização */}
    <img 
      src={img} 
      alt="Lookbook item" 
      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
      loading="lazy"
      decoding="async" 
    />
    
    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center backdrop-blur-[2px]">
      <p className="text-white font-bold text-sm mb-3 italic leading-tight">
        "Style is a way to say who you are."
      </p>
      <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-colors flex items-center gap-1">
        Ver <ArrowRight size={12} />
      </button>
    </div>

    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-900 shadow-sm">
        @SRSPORTLINE
    </div>
  </div>
);