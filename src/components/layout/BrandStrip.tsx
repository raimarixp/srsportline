import { useNavigate } from 'react-router-dom';

// ✅ USANDO CDN DO SIMPLE ICONS (Carregamento Garantido)
const BRANDS = [
  { 
    name: 'Nike', 
    slug: 'nike', 
    // Logo preto padrão
    logo: 'https://cdn.simpleicons.org/nike/000000' 
  },
  { 
    name: 'Adidas', 
    slug: 'adidas', 
    logo: 'https://cdn.simpleicons.org/adidas/000000' 
  },
  { 
    name: 'Jordan', 
    slug: 'jordan', 
    // O ícone do Jordan no simple icons às vezes não existe, vamos usar um fallback seguro ou manter o da wikimedia que costuma funcionar
    logo: 'https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg' 
  },
  { 
    name: 'Puma', 
    slug: 'puma', 
    logo: 'https://cdn.simpleicons.org/puma/000000' 
  },
  { 
    name: 'New Balance', 
    slug: 'new-balance', 
    logo: 'https://cdn.simpleicons.org/newbalance/000000' 
  },
  { 
    name: 'Under Armour', 
    slug: 'under-armour', 
    logo: 'https://cdn.simpleicons.org/underarmour/000000' 
  },
  { 
    name: 'NBA', 
    slug: 'nba', 
    // Usando cor original (azul/vermelho) que ficará cinza pelo nosso CSS grayscale
    logo: 'https://cdn.simpleicons.org/nba' 
  },
];

export const BrandStrip = () => {
  const navigate = useNavigate();

  const handleBrandClick = (slug: string) => {
    navigate(`/categoria/${slug}`);
  };

  return (
    <div className="w-full bg-white border-y border-slate-100 py-10 overflow-hidden relative z-20">
      
      {/* Máscaras de Gradiente (Fade nas pontas) */}
      <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Container da Animação */}
      <div className="flex w-max">
        
        {/* Renderizamos a lista 4 vezes para garantir que a esteira nunca fique vazia em telas grandes */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex animate-infinite-scroll items-center">
            {BRANDS.map((brand) => (
              <div 
                key={brand.slug}
                onClick={() => handleBrandClick(brand.slug)}
                className="mx-8 md:mx-14 cursor-pointer group flex items-center justify-center min-w-[80px]"
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-8 md:h-10 w-auto object-contain transition-all duration-300 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
};