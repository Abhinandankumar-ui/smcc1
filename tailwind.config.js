/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        space: {
          950: '#070a12',
          900: '#0b1120',
          850: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        cyber: {
          cyan: '#00f0ff',
          blue: '#3b82f6',
          indigo: '#6366f1',
          purple: '#8b5cf6',
          magenta: '#d946ef',
          pink: '#f43f5e',
          amber: '#f59e0b',
          orange: '#ff6b00',
          emerald: '#10b981',
          teal: '#14b8a6',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(0, 240, 255, 0.45)',
        'glow-blue': '0 0 25px -4px rgba(59, 130, 246, 0.45)',
        'glow-purple': '0 0 25px -4px rgba(139, 92, 246, 0.45)',
        'glow-pink': '0 0 25px -4px rgba(244, 63, 94, 0.45)',
        'glow-amber': '0 0 25px -4px rgba(245, 158, 11, 0.45)',
        'glow-orange': '0 0 25px -4px rgba(255, 107, 0, 0.45)',
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'pulse-fast': 'pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: 0.5 },
          '100%': { opacity: 0.9 },
        }
      }
    },
  },
  plugins: [],
}
