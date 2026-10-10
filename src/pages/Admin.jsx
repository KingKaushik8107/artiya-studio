
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockKeyhole, LogOut, Plus, Save, Trash2 } from "lucide-react";
import initialProducts from "../data/products.json";
import "./Admin.css";

const API = "/.netlify/functions/manage-products";

function createProduct() {
  return {
    id: `product-${Date.now()}`,
    name: "",
    price: 0,
    category: "Keychains",
    description: "",
    images: [""],
    available: true,
    featured: false,
    createdAt: new Date().toISOString(),
    tags: [],
  };
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "login", password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");

      setLoggedIn(true);
      setPassword("");
      setMessage("Welcome to your admin dashboard!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "logout" }),
      });
    } finally {
      setLoggedIn(false);
      setMessage("");
    }
  }

  function updateProduct(index, field, value) {
    setProducts((current) =>
      current.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      )
    );
  }

  function updateImages(index, value) {
    updateProduct(
      index,
      "images",
      value.split("\n").map((url) => url.trim()).filter(Boolean)
    );
  }

  function addProduct() {
    setProducts((current) => [...current, createProduct()]);
  }

  function deleteProduct(index) {
    if (!window.confirm("Delete this product?")) return;
    setProducts((current) => current.filter((_, i) => i !== index));
  }

  async function saveProducts() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          action: "save-products",
          products: products.map((p) => ({
            ...p,
            price: Number(p.price),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Save failed");

      setMessage(
        "Saved to GitHub! Netlify is rebuilding your storefront."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  if (!loggedIn) {
    return (
      <main className="admin-page">
        <form className="admin-login" onSubmit={login}>
          <div className="admin-icon"><LockKeyhole size={26} /></div>
          <p className="admin-eyebrow">ARTIYA STUDIO</p>
          <h1>Welcome back</h1>
          <p>Sign in to manage your products.</p>

          <label htmlFor="admin-password">Admin password</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="admin-primary" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>

          {message && <p role="status">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">ARTIYA STUDIO</p>
          <h1>Product dashboard</h1>
          <p>Manage your little things with love.</p>
        </div>
        <button className="admin-secondary" onClick={logout}>
          <LogOut size={17} /> Log out
        </button>
      </header>

      <div className="admin-toolbar">
        <span>{products.length} products</span>
        <button className="admin-secondary" onClick={addProduct}>
          <Plus size={17} /> Add product
        </button>
      </div>

      {products.map((product, index) => (
        <section className="admin-product" key={`${product.id}-${index}`}>
          <div className="admin-product-heading">
            <h2>{product.name || "New product"}</h2>
            <button
              className="admin-delete"
              onClick={() => deleteProduct(index)}
              aria-label={`Delete ${product.name || "product"}`}
            >
              <Trash2 size={17} />
            </button>
          </div>

          <div className="admin-fields">
            <label>
              Product ID
              <input
                value={product.id}
                onChange={(e) =>
                  updateProduct(index, "id", e.target.value)
                }
                required
              />
            </label>

            <label>
              Product name
              <input
                value={product.name}
                onChange={(e) =>
                  updateProduct(index, "name", e.target.value)
                }
                required
              />
            </label>

            <label>
              Price (₹)
              <input
                type="number"
                min="0"
                step="0.01"
                value={product.price}
                onChange={(e) =>
                  updateProduct(index, "price", e.target.value)
                }
                required
              />
            </label>

            <label>
              Category
              <select
                value={product.category}
                onChange={(e) =>
                  updateProduct(index, "category", e.target.value)
                }
              >
                <option>Keychains</option>
                <option>Tulips</option>
                <option>Custom Art</option>
              </select>
            </label>

            <label className="admin-wide">
              Description
              <textarea
                value={product.description || ""}
                onChange={(e) =>
                  updateProduct(index, "description", e.target.value)
                }
                rows={3}
              />
            </label>

            <label className="admin-wide">
              Google Drive image URLs (one per line)
              <textarea
                value={(product.images || []).join("\n")}
                onChange={(e) => updateImages(index, e.target.value)}
                rows={3}
                placeholder="https://drive.google.com/file/d/..."
              />
            </label>

            <label className="admin-check">
              <input
                type="checkbox"
                checked={product.available}
                onChange={(e) =>
                  updateProduct(index, "available", e.target.checked)
                }
              />
              Available
            </label>

            <label className="admin-check">
              <input
                type="checkbox"
                checked={product.featured}
                onChange={(e) =>
                  updateProduct(index, "featured", e.target.checked)
                }
              />
              Featured on homepage
            </label>
          </div>
        </section>
      ))}

      <div className="admin-save-bar">
        {message && <p role="status">{message}</p>}
        <button
          className="admin-primary"
          onClick={saveProducts}
          disabled={busy}
        >
          <Save size={17} />
          {busy ? "Saving..." : "Save changes"}
        </button>
      </div>
    </main>
  );
}
