import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getAllProducts } from "./redux/actions/allProductsActions";
import { loadUser } from "./redux/actions/userActions";
import { useEffect, useLayoutEffect } from "react";
import { loadSeller } from "./redux/actions/sellerActions";
import { getAllEvents } from "./redux/actions/eventsActions";
import { useState } from "react";
import { server } from "./server";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import store from "./redux/store";
import loadable from "@loadable/component";

import SellerProtectedRoute from "./protected-routes/SellerProtectedRoute";
import ProtectedRoute from "./protected-routes/Protectedroute";
import Layout from "./components/Layout/Layout";
import LoginPage from "./pages/User/LoginPage";
import Loader from "./components/Loader/Loader";
import HomePage from "./pages/HomePage";

const ActivationPage = loadable(() => import("./pages/User/ActivationPage"));
const ProductsPage = loadable(() => import("./pages/ProductsPage"));
const ProductPage = loadable(() => import("./pages/ProductPage"));
const SignupPage = loadable(() => import("./pages/User/SignupPage"));
const BestSelling = loadable(() => import("./pages/BestSelling"));
const EventsPage = loadable(() => import("./pages/EventsPage"));
const FAQ = loadable(() => import("./pages/FAQPage"));
const ProfilePage = loadable(() => import("./pages/User/ProfilePage"));
const ShopCuponsPage = loadable(() => import("./pages/Seller/ShopCuponsPage"));
const NotFound = loadable(() => import("./components/404/NotFound"));
const CheckoutPage = loadable(() => import("./pages/User/CheckoutPage"));
const ShopHomePage = loadable(() => import("./pages/Seller/ShopHomePage"));

const CreateShop = loadable(
  () => import("./pages/Seller/SellerAuth/CreateShopPage")
);
const SellerActivationPage = loadable(
  () => import("./pages/Seller/SellerAuth/SellerActivationPage")
);
const ShopLoginPage = loadable(
  () => import("./pages/Seller/SellerAuth/ShopLoginPage")
);
const ShopDashboardPage = loadable(
  () => import("./pages/Seller/ShopDashboardPage")
);
const SellerAddProductPage = loadable(
  () => import("./pages/Seller/SellerAddProductPage")
);
const SellerProductsPage = loadable(
  () => import("./pages/Seller/SellerProductsPage")
);
const SellerCreatEventPage = loadable(
  () => import("./pages/Seller/SellerCreatEventPag")
);
const ShopAllEventsPage = loadable(
  () => import("./pages/Seller/ShopAllEventsPage")
);
const SellerAllOrdersPage = loadable(
  () => import("./pages/Seller/SellerAllOrdersPage")
);

function App() {
  const [appState, setAppState] = useState(false);
  const [stripePromise, setStripePromise] = useState<string | null>(null);

  async function getStripeSecretKey() {
    const { data } = await axios.get(`${server}/payments/stripe-secret-key`);
    setStripePromise(data);
  }

  useLayoutEffect(() => {
    Promise.all([
      store.dispatch(loadUser()),
      store.dispatch(loadSeller()),
      store.dispatch(getAllProducts()),
      store.dispatch(getAllEvents()),
    ]).then(() => setAppState(!appState));
  }, []);

  useEffect(() => {
    getStripeSecretKey();
  }, []);

  if (!appState) {
    return (
      <section className="h-screen flex justify-center items-center">
        <Loader />;
      </section>
    );
  }

  return (
    <BrowserRouter>
      {stripePromise && (
        <Elements stripe={loadStripe(stripePromise)}>
          <Routes>
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CheckoutPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Elements>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        />
        <Route
          path="/products/:product_id"
          element={
            <Layout>
              <ProductPage />
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <ProductsPage />
            </Layout>
          }
        />

        <Route
          path="/best-selling"
          element={
            <Layout>
              <BestSelling />
            </Layout>
          }
        />
        <Route
          path="/events"
          element={
            <Layout>
              <EventsPage />
            </Layout>
          }
        />
        <Route
          path="/faq"
          element={
            <Layout>
              <FAQ />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* shop routes */}
        <Route path="/create-shop" element={<CreateShop />} />
        <Route path="/login-shop" element={<ShopLoginPage />} />
        <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/shop-add-product"
          element={
            <SellerProtectedRoute>
              <SellerAddProductPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/shop-orders"
          element={
            <SellerProtectedRoute>
              <SellerAllOrdersPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/shop-create-event"
          element={
            <SellerProtectedRoute>
              <SellerCreatEventPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/shop-products"
          element={
            <SellerProtectedRoute>
              <SellerProductsPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/shop-events"
          element={
            <SellerProtectedRoute>
              <ShopAllEventsPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/shop-cupouns"
          element={
            <SellerProtectedRoute>
              <ShopCuponsPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/shop/:shopId"
          element={
            <SellerProtectedRoute>
              <ShopHomePage />
            </SellerProtectedRoute>
          }
        />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
