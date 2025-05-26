import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'vite-plugin-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  base: '/dist/',
  build: {
    minify: 'terser',
    terserOptions: {
      keep_classnames: true,
    },
  },
  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src'),
    }),
  ],
}