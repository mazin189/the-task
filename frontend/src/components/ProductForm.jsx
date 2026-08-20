import { useEffect, useState } from 'react';

const emptyForm = {
  name: '',
  price: '',
  stockQuantity: '',
};

export default function ProductForm({
  initialValues = emptyForm,
  onSubmit,
  onCancel,
  submitLabel = 'Save Product',
  loading = false,
}) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      name: initialValues.name ?? '',
      price: initialValues.price ?? '',
      stockQuantity: initialValues.stockQuantity ?? '',
    });
    setErrors({});
  }, [initialValues]);

 const validate = () => {
  if (!form.name) {
    setErrors({ name: 'Name is required' });
    return false;
  }

  if (form.price <= 0) {
    setErrors({ price: 'Price must be greater than 0' });
    return false;
  }

  if (form.stockQuantity < 0) {
    setErrors({ stockQuantity: 'Stock cannot be negative' });
    return false;
  }

  setErrors({});
  return true;
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      name: String(form.name).trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Product name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Coffee Mug"
            disabled={loading}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label>
          Price
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            disabled={loading}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </label>

        <label>
          Stock quantity
          <input
            type="number"
            name="stockQuantity"
            value={form.stockQuantity}
            onChange={handleChange}
            placeholder="0"
            disabled={loading}
          />
          {errors.stockQuantity && (
            <span className="field-error">{errors.stockQuantity}</span>
          )}
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
