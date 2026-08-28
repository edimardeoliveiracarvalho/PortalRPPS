import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const getBuildInfo = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { timeZone: 'America/Sao_Paulo' };
  
  const formatterDate = new Intl.DateTimeFormat('pt-BR', { ...options, day: '2-digit', month: '2-digit', year: 'numeric' });
  const formatterTime = new Intl.DateTimeFormat('pt-BR', { ...options, hour: '2-digit', minute: '2-digit', hour12: false });
  const formatterDay = new Intl.DateTimeFormat('pt-BR', { ...options, day: 'numeric' });
  const formatterMonth = new Intl.DateTimeFormat('pt-BR', { ...options, month: 'long' });
  const formatterYear = new Intl.DateTimeFormat('pt-BR', { ...options, year: 'numeric' });

  const dataStr = formatterDate.format(now);
  const horaStr = formatterTime.format(now);
  const monthName = formatterMonth.format(now);
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const textoExtenso = `${formatterDay.format(now)} de ${capitalizedMonth} de ${formatterYear.format(now)}`;

  return {
    data: dataStr,
    hora: horaStr,
    textoExtenso
  };
};

export default defineConfig(() => {
  const buildInfo = getBuildInfo();
  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    define: {
      __APP_BUILD_INFO__: JSON.stringify(buildInfo),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
