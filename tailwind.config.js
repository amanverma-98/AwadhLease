/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b1220',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5f5',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc'
        },
        brand: {
          600: '#4f46e5',
          500: '#6366f1',
          400: '#818cf8'
        },
        emerald: {
          600: '#059669',
          500: '#10b981',
          400: '#34d399'
        }
      },
      boxShadow: {
        glow: '0 0 40px rgba(99, 102, 241, 0.25)',
        card: '0 20px 45px rgba(15, 23, 42, 0.15)',
        soft: '0 14px 30px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top, rgba(99, 102, 241, 0.22), transparent 60%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.08))'
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
