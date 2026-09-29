import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BeerCatalog from "./pages/BeerCatalog";
import BeerDetails from "./pages/BeerDetails";
import Admin from "./pages/Admin";
import AdminBeers from "./pages/AdminBeers";
import AdminBeerEdit from "./pages/AdminBeerEdit";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Header from "./components/Header";
import ServiceOrders from "./pages/ServiceOrders";
import OrderDetails from "./pages/OrderDetails";
import Playroom from "./pages/Playroom";
import PlaceOrder from "./pages/PlaceOrder";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<BeerCatalog />} />
        <Route path="/beers/new" element={<BeerDetails />} />
        <Route path="/beers/:id" element={<BeerDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/service" element={<ServiceOrders />} />
        <Route path="/service/order/:id" element={<OrderDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/beers" element={<AdminBeers />} />
        <Route path="/admin/beers/:id/edit" element={<AdminBeerEdit />} />
        <Route path="/playroom" element={<Playroom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
