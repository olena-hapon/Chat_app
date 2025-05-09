import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   base: '/Chat_app/',
//   plugins: [react()],
// })
// vite.config.ts

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': 'http://localhost:3000', // або на продакшн сервер, наприклад на Render
//     },
//   },
// });


export default defineConfig({
  base: './',  // Встановити базовий шлях для статичних файлів
  plugins: [react()],
  server: {
    open: true, // автоматично відкривати сайт
  },
})
