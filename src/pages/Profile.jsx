import React, { useState, useEffect } from "react";
import "../styles/Profile.css";

const Profile = () => {
  const [allergies, setAllergies] = useState(() => {
    return JSON.parse(localStorage.getItem("allergies")) || [];
  });

  const [medicalHistory, setMedicalHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("medicalHistory")) || [];
  });
  const [allergyInput, setAllergyInput] = useState("");
  const [medicalInput, setMedicalInput] = useState("");

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedAllergies = localStorage.getItem("allergies");
    const savedMedicalHistory = localStorage.getItem("medicalHistory");

    if (savedAllergies) setAllergies(JSON.parse(savedAllergies));
    if (savedMedicalHistory) setMedicalHistory(JSON.parse(savedMedicalHistory));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("allergies", JSON.stringify(allergies));
    localStorage.setItem("medicalHistory", JSON.stringify(medicalHistory));
  }, [allergies, medicalHistory]);

  const handleAddAllergy = (e) => {
    e.preventDefault();
    if (allergyInput.trim()) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput("");
    }
  };

  const handleAddMedical = (e) => {
    e.preventDefault();
    if (medicalInput.trim()) {
      setMedicalHistory([...medicalHistory, medicalInput.trim()]);
      setMedicalInput("");
    }
  };

  const handleRemoveAllergy = (indexToRemove) => {
    setAllergies(allergies.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveMedical = (indexToRemove) => {
    setMedicalHistory(
      medicalHistory.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>
      <p className="profile-subtitle">
        Set up your profile with your allergies and medical history for personalized ingredient analysis
      </p>
      <div className="profile-section">
        <div className="section-group">
          <h2>Allergies</h2>
          <form onSubmit={handleAddAllergy} className="input-container">
            <input
              type="text"
              placeholder="Add allergy..."
              className="profile-input"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
            />
            <button type="submit" className="add-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add
            </button>
          </form>
          <div className="tags-container">
            {allergies.map((allergy, index) => (
              <span key={index} className="tag">
                {allergy}
                <button
                  className="remove-tag"
                  onClick={() => handleRemoveAllergy(index)}
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="section-group">
          <h2>Medical History</h2>
          <form onSubmit={handleAddMedical} className="input-container">
            <input
              type="text"
              placeholder="Add medical condition..."
              className="profile-input"
              value={medicalInput}
              onChange={(e) => setMedicalInput(e.target.value)}
            />
            <button type="submit" className="add-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add
            </button>
          </form>
          <div className="tags-container">
            {medicalHistory.map((condition, index) => (
              <span key={index} className="tag">
                {condition}
                <button
                  className="remove-tag"
                  onClick={() => handleRemoveMedical(index)}
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
