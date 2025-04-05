import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Configuration for local development with Lovable support
export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    fs: {
      // Explicitly set strict file serving policy
      strict: true,
      // Define allowed directories to prevent directory traversal
      allow: [path.resolve(__dirname)],
      // Explicitly deny access to sensitive directories
      deny: ['.git', '.env', 'node_modules/.vite']
    },
    hmr: {
      // Configure HMR to avoid WebSocket token issues
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
      clientPort: 8080,
      overlay: true,
    },
    // Enhanced CORS configuration
    cors: {
      origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: false,
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['path', 'fs', 'crypto'],
  },
  // Properly handle Node.js built-ins
  define: {
    // Use actual environment variables
    'process.env': process.env,
    // Define the WebSocket token dynamically
    __WS_TOKEN__: JSON.stringify(process.env.WS_TOKEN || "development-ws-token")
  },
  // Add esbuild options to use the patched version
  esbuild: {
    // Apply additional security settings for esbuild
    supported: {
      // Ensure modern features are used
      'top-level-await': true
    }
  }
}));
