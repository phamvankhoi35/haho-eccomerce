<!-- <!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
``` -->

Phase 1: Project setup & structure
Công nghệ / tools:
ReactJS 18+
Vite hoặc Create React App (CRA)
React Router v6+
TypeScript (strongly recommended cho dự án lớn)
Prettier + ESLint (code style & linting)
TailwindCSS hoặc Chakra/UI library
Structure cơ bản:

src/
  api/          // gọi API
  components/   // reusable UI components
  features/     // mỗi feature 1 folder (auth, products, cart)
  pages/        // route pages
  store/        // Redux Toolkit
  utils/        // helper, constants
  App.tsx

Phase 2: State management
- Lựa chọn lâu dài:
- Redux Toolkit + RTK Query
- Quản lý state toàn app (auth, cart, products)
- RTK Query để gọi API, caching, re-fetching tự động
- Alternatives: React Context (nhẹ) hoặc Recoil (nâng cao, nhưng ít phổ biến hơn)

Mẹo:
- Tách slice riêng cho auth, cart, products, orders
- Dùng createAsyncThunk cho async action
- Dùng middleware cho logging / interceptors nếu cần

Phase 3: Authentication & User flow
JWT + Refresh token
Đăng ký / đăng nhập / logout
Lưu token:
httpOnly cookie → bảo mật tốt hơn
fallback: localStorage
Refresh token tự động khi token hết hạn
Role-based routing:
Guest → xem sản phẩm
User → mua hàng, xem lịch sử
Admin → quản lý sản phẩm, đơn hàng
Giao diện user:
Profile
Order history
Cart & Checkout

Phase 4: Product & Cart
Product listing page:
Pagination / Infinite scroll
Sorting, filtering, search
Product detail page
Cart:
Redux store lưu giỏ hàng
Persist giỏ hàng bằng localStorage
Advanced:
Virtualized list cho >10k items (react-virtualized / react-window)

Phase 5: Checkout & Payment
Form checkout với validation
Integration payment gateway (Stripe, PayPal)
Order summary, confirmation
Update stock quantity

Phase 6: Admin panel
Dashboard: quản lý sản phẩm, đơn hàng
Add / Edit / Delete products
Quản lý user roles
Advanced:
Charts / stats (recharts, chart.js)
Export CSV / PDF đơn hàng

Phase 7: Optimization & best practice
Code splitting / lazy loading routes
Memoization: React.memo, useMemo, useCallback
Image optimization / lazy loading
SEO + meta tags cho từng page
Error boundary

Phase 8: Testing
Unit tests: Jest + React Testing Library
Integration tests: cypress / Playwright
Redux slice test

Phase 9: Deployment & CI/CD
Hosting: Vercel / Netlify / AWS Amplify
CI/CD pipeline: GitHub Actions
HTTPS, security headers, env variables

Phase 10: Advanced / mở rộng
i18n (react-i18next)
Dark mode / theme switcher
Progressive Web App (PWA)
WebSocket / real-time notifications
Micro-frontend / Module Federation (cho dự án lớn cực kỳ phức tạp)

✅ Tóm tắt công nghệ “lâu dài” trong dự án
React 18 + TypeScript
Redux Toolkit + RTK Query
Axios
Tailwind / Component library
JWT + Refresh token
React Router v6
Jest / React Testing Library
Vercel / Netlify (hoặc AWS Amplify)

[Browser / React App]
        |
        |---> [useAuth hook / ProtectedRoute] ---> gọi API: GET /auth/profile
        |        (Kiểm tra user, role)
        |
        |---> [Header / Navbar] 
        |        hiển thị user, cart count
        |        lấy từ Redux Cart / useAuth
        |
        |---> [Product List Page] 
        |        - Lần đầu: fetch /products
        |        - Cache tạm trong Redux hoặc React Query
        |        - Pagination / Filtering / Sorting → fetch thêm khi cần
        |
        |---> [Cart Component] 
        |        - Redux lưu tạm thời cart items
        |        - User add/remove item → dispatch action + call API sync
        |
        |---> [Checkout Page] 
        |        - Lấy cart từ Redux
        |        - Submit → POST /orders
        |
        |---> [Order History Page]
                 - Fetch /orders?userId=xxx trực tiếp khi render
                 - Không cần lưu Redux (cache optional)

[Redux / State Management]
        |
        |---> Cart Slice → UI realtime
        |---> User / Auth Slice → tạm lưu user info (role, name)
        |---> Product Slice → cache product list
        |---> Order Slice → optional cache

[Backend (NodeJS / Spring / JSON Server)]
        |
        |---> /auth/login, /auth/refresh, /auth/logout
        |        - Lưu token httpOnly cookie
        |        - Xác thực role
        |
        |---> /products
        |        - GET: public / cached
        |        - POST/PUT/DELETE: admin only
        |
        |---> /cart
        |        - Sync cart items khi add/remove
        |
        |---> /orders
                 - GET / POST / PUT (admin: full access) -->








# thiet lap reactjs vite typescript tailwind tao layout cho user, admin, lazy loading + suspense, protected routes, role routes, redux + react query, auth login logout, signup thunk, auth service, axios client

# Tạo project React + TS
npm create vite@latest my-ecommerce --template react-ts
cd my-ecommerce

# Cài TailwindCSS
<!-- npm install -D tailwindcss postcss autoprefixer -->
npm install -D tailwindcss @tailwindcss/vite
npx tailwindcss init -p

# Cài Redux Toolkit + React-Redux
npm install @reduxjs/toolkit react-redux

# Cài React Router
npm install react-router-dom

# Cài Axios
npm install axios


# Thêm tailwindcss
vite.config.ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
})