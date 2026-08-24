import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://brundavan-publications-production.up.railway.app/api";

const EMPTY_FORM = {
  title: "",
  description: "",
  originalPrice: "",
  discountPercent: 0,
  stock: "",
  language: "ENGLISH",
  subject: "ARITHMETIC",
  coverImageUrl: "",
  isActive: true,
  mediums: [],
};

const MEDIUMS = ["KANNADA", "ENGLISH", "HINDI", "MARATHI"];

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM, mediums: [] });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/books`);

      if (!response.ok) {
        throw new Error("Failed to load books");
      }

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ ...EMPTY_FORM, mediums: [] });
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMediumChange = (medium) => {
    setForm((previous) => {
      const exists = previous.mediums.includes(medium);

      return {
        ...previous,
        mediums: exists
          ? previous.mediums.filter((item) => item !== medium)
          : [...previous.mediums, medium],
      };
    });
  };

  const calculatePrice = () => {
    const original = Number(form.originalPrice || 0);
    const discount = Number(form.discountPercent || 0);

    return (original - (original * discount) / 100).toFixed(2);
  };

  const startEdit = (book) => {
    const mediums = Array.isArray(book.mediums)
      ? book.mediums
          .map((item) =>
            typeof item === "string" ? item : item?.medium
          )
          .filter(Boolean)
      : [];

    setForm({
      title: book.title || "",
      description: book.description || "",
      originalPrice: book.originalPrice ?? book.price ?? "",
      discountPercent: book.discountPercent ?? 0,
      stock: book.stock ?? "",
      language: book.language || "ENGLISH",
      subject: book.subject || "ARITHMETIC",
      coverImageUrl: book.coverImageUrl || "",
      isActive: book.isActive !== false,
      mediums,
    });

    setEditingId(book.id);
    setShowForm(true);
  };

  const saveBook = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!form.originalPrice) {
      alert("Please enter original price.");
      return;
    }

    if (form.mediums.length === 0) {
      alert("Please select at least one medium.");
      return;
    }

    const originalPrice = Number(form.originalPrice);
    const discountPercent = Number(form.discountPercent || 0);

    const finalPrice =
      originalPrice - (originalPrice * discountPercent) / 100;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      originalPrice,
      discountPercent,
      price: Number(finalPrice.toFixed(2)),
      stock: Number(form.stock),
      language: form.language,
      subject: form.subject,
      coverImageUrl: form.coverImageUrl.trim(),
      isActive: form.isActive,
      mediums: form.mediums.map((medium) => ({ medium })),
    };

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/books/${editingId}`
        : `${API_URL}/books`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await fetchBooks();
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Unable to save book.");
    } finally {
      setSaving(false);
    }
  };

  const deactivateBook = async (book) => {
    const confirmed = window.confirm(
      `Deactivate "${book.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/books/${book.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Deactivate failed");
      }

      await fetchBooks();
    } catch (error) {
      console.error(error);
      alert("Unable to deactivate book.");
    }
  };

  const reactivateBook = async (book) => {
    try {
      const response = await fetch(
        `${API_URL}/books/${book.id}/reactivate`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Reactivate failed");
      }

      await fetchBooks();
    } catch (error) {
      console.error(error);
      alert("Unable to reactivate book.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="section-tag">BRUNDAVAN PUBLICATIONS</p>
          <h1>Admin Dashboard</h1>
          <p>
            Manage books, prices, offers, stock and mediums.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link
            to="/admin/orders"
            className="secondary-btn"
          >
            View Orders
          </Link>

          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              if (showForm) {
                resetForm();
                return;
              }

              setForm({ ...EMPTY_FORM, mediums: [] });
              setEditingId(null);
              setShowForm(true);
            }}
          >
            {showForm ? "Close Form" : "+ Add Book"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-form-card">
          <h2>{editingId ? "Edit Book" : "Add New Book"}</h2>

          <form onSubmit={saveBook}>
            <input
              type="text"
              name="title"
              placeholder="Book Title"
              value={form.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Book Description"
              rows="4"
              value={form.description}
              onChange={handleChange}
            />

            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price"
              value={form.originalPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />

            <input
              type="number"
              name="discountPercent"
              placeholder="Discount %"
              value={form.discountPercent}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
            />

            <div className="calculated-price">
              Final Price: <strong>₹{calculatePrice()}</strong>
            </div>

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              required
            />

            <input
              type="text"
              name="coverImageUrl"
              placeholder="Cover Image URL"
              value={form.coverImageUrl}
              onChange={handleChange}
            />

            <select
              name="language"
              value={form.language}
              onChange={handleChange}
            >
              <option value="ENGLISH">English</option>
              <option value="KANNADA">Kannada</option>
            </select>

            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
            >
              <option value="ARITHMETIC">Arithmetic</option>
              <option value="MENTAL_ABILITY">Mental Ability</option>
              <option value="PASSAGES">Passages</option>
              <option value="ANKAGANITH">Ankaganith</option>
            </select>

            <div className="medium-checkboxes">
              <h3>Available Mediums</h3>

              {MEDIUMS.map((medium) => (
                <label key={medium}>
                  <input
                    type="checkbox"
                    checked={form.mediums.includes(medium)}
                    onChange={() =>
                      handleMediumChange(medium)
                    }
                  />
                  {medium}
                </label>
              ))}
            </div>

            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active
            </label>

            <div className="form-buttons">
              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Book"
                  : "Add Book"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="admin-books">
        <h2>Books</h2>

        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="admin-books-grid">
            {books.map((book) => {
              const mediums = Array.isArray(book.mediums)
                ? book.mediums
                    .map((item) =>
                      typeof item === "string"
                        ? item
                        : item?.medium
                    )
                    .filter(Boolean)
                : [];

              return (
                <div
                  className="admin-book-card"
                  key={book.id}
                >
                  <h3>{book.title}</h3>

                  <p>
                    Price: ₹
                    {Number(book.price || 0).toFixed(2)}
                  </p>

                  <p>Stock: {book.stock}</p>
                  <p>Language: {book.language}</p>
                  <p>Subject: {book.subject}</p>

                  <p>
                    Status:{" "}
                    {book.isActive ? "Active" : "Inactive"}
                  </p>

                  <p>
                    Mediums:{" "}
                    {mediums.length
                      ? mediums.join(", ")
                      : "None"}
                  </p>

                  <div className="card-buttons">
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => startEdit(book)}
                    >
                      Edit
                    </button>

                    {book.isActive ? (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() =>
                          deactivateBook(book)
                        }
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() =>
                          reactivateBook(book)
                        }
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;