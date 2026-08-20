import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <span className="brand-mark">POS</span>
          <div>
            <strong>Mini POS</strong>
            <p>Inventory & Checkout</p>
          </div>
        </div>
        <nav className="nav-links">
          <NavLink to="/">
            Products
          </NavLink>
          <NavLink to="/cashier">Cashier</NavLink>
        </nav>
      </div>
    </header>
  );
}
