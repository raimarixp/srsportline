import { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    id: 1,
    // Imagem da Seleção/Torcida (Vibe Brasil)
    bgImage: 'https://i.ibb.co/39mMn9qj/Design-sem-nome-1.png',
    subtitle: 'COLEÇÃO OFICIAL 2026',
    title: 'A AMARELINHA',
    highlight: 'PESA',
    description: 'Tecnologia Dri-Fit ADV. Feita para brilhar no maior palco do mundo.',
    buttonText: 'COMPRAR BRASIL',
    link: '/categoria/futebol',
    buttonColor: 'bg-yellow-400 text-black hover:bg-yellow-300'
  },
  {
    id: 2,
    // Imagem Jordan/Urban (Vibe Basquete)
    bgImage: 'https://i.ibb.co/sJqfhmDW/hero-jordan.png',
    subtitle: 'JORDAN BRAND',
    title: 'FLIGHT',
    highlight: 'LEGACY',
    description: 'O ícone das quadras recriado para o asfalto. Voe mais alto.',
    buttonText: 'VER SNEAKERS',
    link: '/categoria/tenis',
    buttonColor: 'bg-white text-black hover:bg-gray-200'
  },
  {
    id: 3,
    // Imagem Estádio (Vibe Clubes)
    bgImage: 'https://images.unsplash.com/photo-1628891435231-15d2a9d82138?q=80&w=2070&auto=format&fit=crop',
    subtitle: 'TEMPORADA 2024',
    title: 'PAIXÃO',
    highlight: 'NACIONAL',
    description: 'Vista as cores do seu time com as camisas oficiais da nova temporada.',
    buttonText: 'VER CLUBES',
    link: '/categoria/futebol',
    buttonColor: 'bg-blue-600 text-white hover:bg-blue-700'
  }
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] bg-black overflow-hidden group">
      
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* 1. IMAGEM DE FUNDO (Full Screen) */}
          <div className="absolute inset-0">
            <img 
              src={slide.bgImage} 
              className="w-full h-full object-cover"
              alt="" 
            />
            
            {/* 2. OVERLAY UNIFORME (O Segredo do Contraste) 
                bg-black/50 = Uma película preta 50% transparente sobre TUDO.
                Isso escurece a foto uniformemente, sem esconder detalhes laterais,
                e garante que o texto branco seja lido perfeitamente. 
            */}
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Gradiente extra só no rodapé para os botões de navegação não sumirem */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          {/* 3. TEXTO (Centralizado e Impactante) */}
          <div className="relative z-20 h-full max-w-5xl mx-auto px-6 flex flex-col justify-center items-center text-center">
            
            <div className={`space-y-6 transform transition-all duration-1000 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              
              <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-bold tracking-[0.3em] uppercase text-white backdrop-blur-sm">
                {slide.subtitle}
              </span>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-lg">
                {slide.title} <br />
                {/* Texto vazado (Stroke) ou com cor de destaque */}
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                  {slide.highlight}
                </span>
              </h1>
              
              <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
                {slide.description}
              </p>

              <div className="pt-8">
                <button 
                  onClick={() => navigate(slide.link)}
                  className={`${slide.buttonColor} px-10 py-4 font-bold text-sm md:text-base uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-black/20 rounded-sm flex items-center gap-3 mx-auto`}
                >
                  {slide.buttonText} <ArrowRight size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>
      ))}

      {/* 4. CONTROLES LATERAIS */}
      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 text-white/50 hover:text-white hover:bg-black/20 rounded-full transition-all"
      >
         <ChevronLeft size={40} />
      </button>

      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 text-white/50 hover:text-white hover:bg-black/20 rounded-full transition-all"
      >
         <ChevronRight size={40} />
      </button>

      {/* 5. INDICADORES (BOLINHAS) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {SLIDES.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrent(idx)} 
            className={`h-1 transition-all duration-500 rounded-full ${idx === current ? 'w-12 bg-white' : 'w-4 bg-white/40 hover:bg-white/80'}`} 
          />
        ))}
      </div>

    </div>
  );
};