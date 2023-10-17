import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Lineprediction() {
  const [selectedDesign, setSelectedDesign] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);

  const handlePredict = () => {
    // Make a POST request to the Flask API to get the prediction result based on the selected design
    axios.post('http://127.0.0.1:5000/predict', { selectedDesign })
      .then(response => {
        console.log('Prediction Result:', response.data);
        // Handle the prediction result here (e.g., display the result)
        setPredictionResult(response.data);
      })
      .catch(error => {
        console.error('Prediction Error:', error);
        // Handle the error here (e.g., show an error message)
      });
  };

  return (
    <div className="container mt-4 add-users">
      <h2>Predict the best line for your design</h2>
      <div className="section">
        <div className="row">
          <div className="col-md-6">
            <select className="form-control mt-4" value={selectedDesign} onChange={(e) => setSelectedDesign(e.target.value)}>
              <option value="">Select your design</option>
              <option value="Design A">Design A</option>
              <option value="Design B">Design B</option>
              <option value="Design C">Design C</option>
              {/* Add more design options here as needed */}
            </select>
          </div>
        </div>
      </div>
      <div className="row mt-3 text-end">
        <div className="col-md-6">
          <button className="btn btn-success" onClick={handlePredict}>
            Submit
          </button>
        </div>
      </div>
      {/* Display the prediction result */}
      
    </div>
  );
}

export default Lineprediction;
