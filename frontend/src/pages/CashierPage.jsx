import { useEffect, useState } from "react";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { createInvoice } from "../services/invoiceService";
import { getProducts } from "../services/productService";

const currency = (value) => {
  return `${value.toFixed(2)}`;
};

export default function CashierPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getCartQuantity = (productId) => {
    const item = cart.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const addToCart = (product) => {
    setError("");
    setSuccess("");

    const existing = cart.find((item) => item.productId === product._id);

    if (existing) {
      if (existing.quantity >= product.stockQuantity) {
        setError("No more stock available.");
        return;
      }

      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );

      return;
    }

    setCart([
      ...cart,
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stockQuantity: product.stockQuantity,
      },
    ]);
  };

  const increaseQuantity = (productId) => {
    setCart(
      cart.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        if (item.quantity >= item.stockQuantity) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }),
    );
  };

  const decreaseQuantity = (productId) => {
    setCart(
      cart
        .map((item) => {
          if (item.productId !== productId) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0),
    );
  };          

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return;
    }

    try {
      setCheckingOut(true);
      setError("");
      setSuccess("");

      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const invoice = await createInvoice(items);

      setCart([]);
      setSuccess(`Sale completed. Total: ${currency(invoice.totalPrice)}`);

      await loadProducts();
    } catch (err) {
      setError(err.message);
      await loadProducts();
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading products..." />;
  }

  return (
    <section className="page">
      <div className="page-header">
        <h1>Cashier</h1>
        <p>Add products to the cart and confirm the sale.</p>
      </div>

      <AlertMessage type="error" message={error} onClose={() => setError("")} />

      <AlertMessage
        type="success"
        message={success}
        onClose={() => setSuccess("")}
      />

      <div className="cashier-layout">
        <div className="panel">
          <div className="panel-header">
            <h2>Products</h2>
            <span>{products.length} items</span>
          </div>

          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => {
                const quantity = getCartQuantity(product._id);

                return (
                  <article key={product._id} className="product-card">
                    <h3>{product.name}</h3>

                    <p className="price">{currency(product.price)}</p>

                    <p>Stock: {product.stockQuantity}</p>

                    {quantity > 0 && <p>In cart: {quantity}</p>}

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => addToCart(product)}
                      disabled={
                        checkingOut || quantity >= product.stockQuantity
                      }
                    >
                      {product.stockQuantity === 0
                        ? "Out of stock"
                        : quantity >= product.stockQuantity
                          ? "Max in cart"
                          : "Add to cart"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="panel cart-panel">
          <div className="panel-header">
            <h2>Cart</h2>
            <span>{cart.length} items</span>
          </div>

          {cart.length === 0 ? (
            <p>Cart is empty.</p>
          ) : (
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.productId} className="cart-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {currency(item.price)} × {item.quantity}
                    </p>
                  </div>

                  <div className="cart-item-controls">
                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() => decreaseQuantity(item.productId)}
                      disabled={checkingOut}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() => increaseQuantity(item.productId)}
                      disabled={
                        checkingOut || item.quantity >= item.stockQuantity
                      }
                    >
                      +
                    </button>

                    <strong>{currency(item.price * item.quantity)}</strong>

                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => removeFromCart(item.productId)}
                      disabled={checkingOut}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <strong>{currency(getTotal())}</strong>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkingOut}
            >
              {checkingOut ? "Processing..." : "Confirm sale"}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
