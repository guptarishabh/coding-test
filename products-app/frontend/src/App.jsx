import { useEffect, useState } from 'react';

const API = '/api/products';

// Reads an error message from a non-2xx response, falling back to the status.
async function errorMessage(res) {
  try {
    const body = await res.json();
    return body.message || body.error || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadProducts() {
    setError('');
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(await errorMessage(res));
      setProducts(await res.json());
    } catch (e) {
      setError(e.message || 'Could not load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Name is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) throw new Error(await errorMessage(res));
      setName('');
      await loadProducts();
    } catch (e) {
      setError(e.message || 'Could not create product');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Products</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          aria-label="Product name"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add'}
        </button>
      </form>

      {error && (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <ul data-testid="product-list">
          {products.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
