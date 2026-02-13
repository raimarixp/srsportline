/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',      // Agora é um Azul Marinho quase preto (Texto)
          blue: '#2563eb',      // Azul Royal vibrante (Botões)
          red: '#ef4444',       // Vermelho (Detalhes)
          bg: '#f8fafc',        // Branco Gelo (Fundo do site)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // 👇 ADICIONE DAQUI PARA BAIXO
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      }
    },
  },


  theme: {
    extend: {
      // ... cores e fontes
      animation: {
        'infinite-scroll': 'infinite-scroll 40s linear infinite',
        // 👇 NOVA ANIMAÇÃO (Para a direita)
        'infinite-scroll-reverse': 'infinite-scroll-reverse 40s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        // 👇 NOVOS KEYFRAMES (Começa em -100% e vai para 0)
        'infinite-scroll-reverse': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}

