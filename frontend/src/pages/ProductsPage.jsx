import { useEffect, useState } from 'react';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductForm from '../components/ProductForm';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../services/productService';

const currency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
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

  const handleCreate = async (payload) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await createProduct(payload);
      setSuccess('Product created successfully.');
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateProduct(editingProduct._id, payload);
      setSuccess('Product updated successfully.');
      setEditingProduct(null);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {

    setDeletingId(product._id);
    setError('');
    setSuccess('');
    try {
      await deleteProduct(product._id);
      setSuccess(`"${product.name}" deleted.`);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage inventory items, prices, and stock levels.</p>
        </div>
      </div>

      <AlertMessage type="error" message={error} onClose={() => setError('')} />
      <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />

      <div className="panel">
        <h2>{editingProduct ? 'Edit product' : 'Add product'}</h2>
        <ProductForm
          initialValues={
            editingProduct
              ? {
                  name: editingProduct.name,
                  price: editingProduct.price,
                  stockQuantity: editingProduct.stockQuantity,
                }
              : undefined
          }
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          onCancel={editingProduct ? () => setEditingProduct(null) : undefined}
          submitLabel={editingProduct ? 'Update Product' : 'Add Product'}
          loading={saving}
        />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Inventory</h2>
          <span className="muted">{products.length} products</span>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading products..." />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products yet</h3>
            <p>Add your first product using the form above.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td data-label="Name">{product.name}</td>
                    <td data-label="Price">{currency(product.price)}</td>
                    <td data-label="Stock">
                      <span
                        className={`stock-badge ${
                          product.stockQuantity === 0 ? 'stock-out' : ''
                        }`}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-small"
                          onClick={() => setEditingProduct(product)}
                          disabled={saving || deletingId === product._id}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(product)}
                          disabled={saving || deletingId === product._id}
                        >
                          {deletingId === product._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
