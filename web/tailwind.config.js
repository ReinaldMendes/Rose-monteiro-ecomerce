/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold:       '#9B8733',
        charcoal:   '#383D3B',
        terra:      '#B75D45',
        sage:       '#ABBAB0',
        nude:       '#E6D3C5',
        cream:      '#F5F0EA',
        'off-white':'#FAF8F5',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      fontSize: {
        /* Escala aumentada para melhor legibilidade */
        'xs':   ['0.8125rem',  { lineHeight: '1.5'  }],  /* 13.8px */
        'sm':   ['0.9375rem',  { lineHeight: '1.65' }],  /* 15.9px */
        'base': ['1.0625rem',  { lineHeight: '1.75' }],  /* 18px   */
        'lg':   ['1.1875rem',  { lineHeight: '1.7'  }],  /* 20px   */
        'xl':   ['1.3125rem',  { lineHeight: '1.6'  }],  /* 22px   */
        '2xl':  ['1.5625rem',  { lineHeight: '1.4'  }],  /* 26px   */
        '3xl':  ['1.9375rem',  { lineHeight: '1.3'  }],  /* 33px   */
        '4xl':  ['2.3125rem',  { lineHeight: '1.2'  }],  /* 39px   */
        '5xl':  ['3rem',       { lineHeight: '1.1'  }],  /* 51px   */
        '6xl':  ['3.75rem',    { lineHeight: '1.05' }],  /* 64px   */
        '7xl':  ['4.5rem',     { lineHeight: '1'    }],  /* 77px   */
        '8xl':  ['6rem',       { lineHeight: '1'    }],  /* 102px  */
      },
      animation: {
        ticker:    'ticker 25s linear infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up':'slideUp 0.5s ease forwards',
        spin:      'spin 1s linear infinite',
      },
      keyframes: {
        ticker:  { from: { transform:'translateX(0)' }, to: { transform:'translateX(-50%)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
