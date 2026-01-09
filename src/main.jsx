import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './components/Home.jsx';
import Header from './components/Header.jsx';
import Footer from './components/footer/Footer.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Login from './components/Login.jsx';
import Cart from './components/Cart.jsx';


const routeDefinitions = createRoutesFromElements(
<Route path="/" element={<App/>} >
 <Route index element={<Home />} />
 <Route path="/home" element={<Home />} />
 <Route element={<Header />} />
 <Route path="/about" element={<About />} />
 <Route path="/contact" element={<Contact />} />
 <Route path="/login" element={<Login />} />
 <Route path="/cart" element={<Cart />} />
 <Route element ={<Footer />} />
</Route>

);

const appRouter = createBrowserRouter(routeDefinitions);


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={appRouter} />
  </StrictMode>,
)
