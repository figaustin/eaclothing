
import NoCategoryProductList from "./components/NoCategoryProductList";
import Home from "./components/Home";
import CategoryProductList from './components/CategoryProductList';
import ProductPage from './components/ProductPage';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import PaymentComplete from './components/PaymentComplete';
import Sales from './components/Sales';
import Accessories from './components/Accessories';
import AdminLanding from './components/admin-pages/AdminLanding';
import NewProduct from './components/admin-pages/NewProduct';
import EditProduct from './components/admin-pages/EditProduct';

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/:gender',
    element: <NoCategoryProductList/>
  },
  {
    path: '/:gender/:category',
    element: <CategoryProductList />
  },
    {
        path: '/product/:productId',
        element: <ProductPage />
    },
    {
        path: '/cart',
        element: <Cart />
    },
    {
        path: '/checkout',
        element: <Checkout />
    },
    {
        path: '/paymentcompleted',
        element: <PaymentComplete />
    },
    {
        path: '/sales',
        element: <Sales />
    },
    {
        path: '/accessories',
        element: <Accessories />
    },
    {
        path: '/admin/products',
        element: <AdminLanding />
    },
    {
        path: '/admin/products/create',
        element: <NewProduct />
    },
    {
        path: '/admin/products/edit/:productId',
        element: <EditProduct />
    },
];

export default AppRoutes;
