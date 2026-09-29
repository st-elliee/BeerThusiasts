import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchBeer, fetchReviews, postReview } from "../api/beer";
import AddBeerForm from "../components/AddBeerForm";
import UploadImageForm from "../components/UploadImageForm";

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001';

export default function BeerDetails() {
  const { id } = useParams();
  const location = useLocation();
  const isCreate = location.pathname.endsWith("/new");
  const [beer, setBeer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [imgTs, setImgTs] = useState(Date.now());
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    if (isCreate) return; // skip fetching when creating a new beer
    fetchBeer(id).then(setBeer).catch(console.error);
    fetchReviews(id).then(setReviews).catch(console.error);
  }, [id, isCreate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postReview(id, { customer_id: Number(customerId), rating: Number(rating), comment });
      setComment("");
      const updated = await fetchReviews(id);
      setReviews(updated);
    } catch (err) {
      console.error(err);
      alert("Failed to post review. Provide a valid customer_id and rating.");
    }
  };

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const averageRating = reviews.length > 0
    ? Number((reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1))
    : 0;

  if (isCreate) {
    return (
      <div className="page-transition" style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh"
      }}>
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "2rem", color: "#2c3e50", marginBottom: "10px" }}>➕ Create New Beer</h1>
          <AddBeerForm />
        </div>
      </div>
    );
  }

  if (!beer) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      fontSize: "1.2rem",
      color: "#7f8c8d"
    }}>
      🍺 Loading beer details...
    </div>
  );

  return (
    <div className="page-transition" style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      minHeight: "100vh"
    }}>
      {/* Beer Header */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "15px",
        padding: "30px",
        marginBottom: "30px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        {/* Image + Upload for admins */}
        <div style={{ marginBottom: '18px' }}>
          <img src={`${API_BASE}/images/beers/${beer.beer_id}.jpg?ts=${imgTs}`} alt={beer.beer_name} style={{ maxWidth: '180px', borderRadius: '8px', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
          {localStorage.getItem('role') === 'admin' && (
            <div style={{ marginTop: '10px' }}>
              <UploadImageForm beerId={beer.beer_id} onUploaded={() => setImgTs(Date.now())} />
            </div>
          )}
        </div>
        <h1 style={{
          fontSize: "2.5rem",
          color: "#2c3e50",
          marginBottom: "10px",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
        }}>
          🍺 {beer.beer_name}
        </h1>

        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}>
          <div style={{
            background: "#3498db",
            color: "white",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "bold"
          }}>
            {beer.brand_name}
          </div>
          <div style={{
            background: "#e74c3c",
            color: "white",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "bold"
          }}>
            {beer.alcohol_content}% ABV
          </div>
          <div style={{
            background: "#27ae60",
            color: "white",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "bold"
          }}>
            €{beer.price}
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          fontSize: "1.1rem",
          color: "#7f8c8d"
        }}>
          <span>Type: {beer.beer_kind}</span>
          <span>•</span>
          <span>Container: {beer.container_kind}</span>
          <span>•</span>
          <span>Volume: {beer.volume_liters}L</span>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "15px",
        padding: "30px",
        marginBottom: "30px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{
          color: "#2c3e50",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          📝 Customer Reviews
          {reviews.length > 0 && (
            <span style={{
              background: "#f39c12",
              color: "white",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "0.9rem"
            }}>
              ⭐ {averageRating} avg ({reviews.length} reviews)
            </span>
          )}
        </h2>

        {reviews.length === 0 ? (
          <p style={{
            textAlign: "center",
            color: "#7f8c8d",
            fontStyle: "italic",
            padding: "40px"
          }}>
            No reviews yet. Be the first to share your thoughts! 🍻
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {reviews.map((r, i) => (
              <div key={i} style={{
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "10px",
                borderLeft: "4px solid #3498db"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <strong style={{ color: "#2c3e50" }}>
                    {r.first_name ? `${r.first_name} ${r.last_name}` : `Customer ${r.customer_id}`}
                  </strong>
                  <span style={{ fontSize: "1.2rem" }}>{renderStars(r.rating)}</span>
                </div>
                <p style={{ color: "#34495e", margin: 0 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Review Section */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "15px",
        padding: "30px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{
          color: "#2c3e50",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          ✍️ Share Your Review
        </h3>

        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: "5px",
              color: "#2c3e50",
              fontWeight: "bold"
            }}>
              Customer ID (required):
            </label>
            <input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #ecf0f1",
                borderRadius: "8px",
                fontSize: "1rem"
              }}
              placeholder="Enter your customer ID"
            />
          </div>

          <div>
            <label style={{
              display: "block",
              marginBottom: "5px",
              color: "#2c3e50",
              fontWeight: "bold"
            }}>
              Rating: {rating} ⭐
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={{
                width: "100%",
                height: "6px",
                borderRadius: "3px",
                background: "#ecf0f1",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              marginBottom: "5px",
              color: "#2c3e50",
              fontWeight: "bold"
            }}>
              Your Comment:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "2px solid #ecf0f1",
                borderRadius: "8px",
                fontSize: "1rem",
                minHeight: "80px",
                resize: "vertical"
              }}
              placeholder="Tell us what you think about this beer..."
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 30px",
              background: "linear-gradient(45deg, #3498db, #2980b9)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
              transition: "transform 0.2s",
              alignSelf: "center"
            }}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            🚀 Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
