import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Product.css";

const Product = ({ product }) => {
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product not found</h1>
        <button onClick={() => navigate("/search")}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className="product-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      <div className="product-container">
        <div className="product-header">
          <h1>{product.name}</h1>
          {product.type === "cosmetic" ? (
            <>
              <span className="brand">{product.brand}</span>
              <span className="category">{product.category}</span>
            </>
          ) : (
            <>
              <span className="composition">{product.composition}</span>
              <span className="uses">{product.uses}</span>
            </>
          )}
        </div>

        <div className="product-details">
          <h2>Details</h2>
          {product.type === "cosmetic" ? (
            <div className="cosmetic-details">
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Ingredients:</strong> {product.ingredients}
              </p>
            </div>
          ) : (
            <div className="medicine-details">
              <p>
                <strong>Composition:</strong> {product.composition}
              </p>
              <p>
                <strong>Uses:</strong> {product.uses}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
