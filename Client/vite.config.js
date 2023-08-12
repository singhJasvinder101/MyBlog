import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import http from "https";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // other Vite configuration options...
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://blog-backend-1m3w.onrender.com',
  //       changeOrigin: true,
  //       secure: false,
  //       ws: true,
  //       agent: new http.Agent(),
  //       configure: (proxy, _options) => {
  //         proxy.on('error', (err, _req, _res) => {
  //           console.log('proxy error', err);
  //         });
  //         proxy.on('proxyReq', (proxyReq, req, _res) => {
  //           console.log('Sending Request to the Target:', req.method, req.url);
  //         });
  //         proxy.on('proxyRes', (proxyRes, req, _res) => {
  //           console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
  //         });
  //       },
  //     },
  //   }
  // },
})