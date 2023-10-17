import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const divisionToStationsMap = {
  'Colombo Central': [
    "Colombo Municipal Council Community Centre, Newhem Square, Colombo 13",
    "St.Anne's Balika Vidyalaya , Vivekananda Hill , Colombo 13",
    "Velankanni Hall, 192, Sri Kathiresan Street , Colombo 13",
    "St. Anthony Boy School,Vivekananda Hill , Colombo 13",
    "Child Welfare Centre, Vivekananda Hill , Colombo 13- Hall No.01"
  ],
  'Colombo East':[
    "S.W.R.D.Bandaranayike Vidyalaya, Kotte Road, Colombo 08 - Hall No.01",
    " S.W.R.D.Bandaranayike Vidyalaya, Kotte Road, Colombo 08 - Hall No.02",
    " Devi Balika Maha Vidyalaya, Model Farm Road, Colombo 08 - Hall No.01",
    "Devi Balika Maha Vidyalaya, Model Farm Road, Colombo 08 - Hall No.02",
    " Elvitigala Flats Commiunity Hall, Narahenpita, Colombo 08"
  ],
  'Colombo West':[
    "St. Thomas Primary School, Kollupitiya Road, Colombo 03 - Hall No. 01",
"St. Thomas Primary School, Kollupitiya Road, Colombo 03 - Hall No. 02",
"Polwatta St. Mary’s Girls School, St.Michael Road, Colombo 03 - Hall No. 01",
"Polwatta St. Mary’s Girls School, St.Michael Road, Colombo 03 - Hall No. 02",
"Mahanama Maha Vidyalaya, Colombo 03 - Hall No. 01"
  ]
};

function PredictionColombo() {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const [filteredStations, setFilteredStations] = useState([]);

  const handleDivisionSelect = (selectedDivision) => {
    setSelectedDivision(selectedDivision);
    setFilteredStations(divisionToStationsMap[selectedDivision] || []);
    setSelectedStation(''); // Reset selected station when division changes
  };

  // Mock data for select options
  const provinces = ['Western'];
  const districts = ['Colombo'];
  const divisions = ['Colombo Central','Colombo East','Colombo West'];
  const stations  = ['A - Colombo North', 'B - Colombo Central','C - Borella','D - Colombo East','E - Colombo West','F - Dehiwala','G - Rathmalana','H - Kolonnawa','I - Kotte','J - Kaduwela',' K - Awissawella','L - Homagama','M - Maharagama','N - Kesbewa'];


  
  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleUpload = () => {
    // Handle the upload logic here
    console.log('Upload button clicked');
    console.log('Selected Province:', selectedProvince);
    console.log('Selected District:', selectedDistrict);
    console.log('Selected Division:', selectedDivision);
    console.log('Selected Station:', selectedStation);
    console.log('CSV File:', csvFile);

    Swal.fire({
      icon: 'success',
      title: 'Upload Successful',
      text: 'CSV file has been uploaded successfully!',
    });
  };

  const [predictionResult, setPredictionResult] = useState(null);


  const handlePredict = () => {
    // Create a FormData object to send the CSV file
    const formData = new FormData();
    formData.append('file', csvFile);

    // Make a POST request to the Flask API
    axios.post('http://127.0.0.1:5000/predict', formData)
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
      <h2>Prediction Upload</h2>
      <div className="section">
        <h4>Location Details</h4>
        <div className="row">
          <div className="col-md-6">
            <label>Select Province:</label>
            <select className="form-control" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
              <option value="">Select</option>
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label>Select District:</label>
            <select className="form-control" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
              <option value="">Select</option>
              {districts.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mt-3">
        <div className="col-md-6">
        <label>Select Polling Division:</label>
        <select className="form-control" value={selectedDivision} onChange={(e) => handleDivisionSelect(e.target.value)}>
          <option value="">Select</option>
          {divisions.map((division, index) => (
            <option key={index} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>
      <div className="col-md-6">
        <label>Select Polling Station:</label>
        <select className="form-control" value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)}>
          <option value="">Select</option>
          {filteredStations.map((station, index) => (
            <option key={index} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>
        </div>
      </div>
      <div className="section mt-3">
        <h4>Upload CSV File</h4>
        <div className="row">
          <div className="col-md-6">
            <label>Choose a CSV file:</label>
            <input type="file" className="form-control-file" accept=".csv" onChange={handleCsvFileChange} />
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <button className="btn btn-primary" onClick={handleUpload}>
            Upload
          </button>
        </div>
        <div className="col-md-6">
          <button className="btn btn-success" onClick={handlePredict}>
            Predict
          </button>
        </div>
        {/* Display the prediction result */}
        {predictionResult && (
          <div className="mt-3">
            <h4 className="mb-3">Prediction Result</h4>
            {Object.keys(predictionResult).map(position => {
              const filteredResults = predictionResult[position].filter(data => data.polling_station !== selectedStation);
              const filteredNonMatchingResults = filteredResults.filter(data => data.polling_station !== data.fam_polling_station);
              
              if (filteredNonMatchingResults.length > 0) {
                return (
                  <div key={position}>
                    <h5>{position}</h5>
                    <ul>
                      {filteredNonMatchingResults.map((data, index) => {
                        // Check if the position is not 'Clerk' or index is less than 20 for selected station A, or less than 30 for selected station B
                        if (
                          (position !== 'Clerk' || (selectedStation === 'Colombo Municipal Council Community Centre, Newhem Square, Colombo 13' && index < 5) || (selectedStation === "St.Anne's Balika Vidyalaya , Vivekananda Hill , Colombo 13" && index < 8)||(selectedStation === 'Velankanni Hall, 192, Sri Kathiresan Street , Colombo 13' && index < 6)||(selectedStation === 'St. Anthony Boy School,Vivekananda Hill , Colombo 13' && index < 8)||(selectedStation === 'Child Welfare Centre, Vivekananda Hill , Colombo 13- Hall No.01' && index < 5)) &&
                          data.polling_station !== data.fam_polling_station &&
                          data.polling_station !== selectedStation && // Add this condition
                          data.fam_polling_station !== selectedStation // Add this condition
                        ) {
                          return (
                            <li key={index}>
                              <p>{data.name}</p>
                            
                            </li>
                          );
                        } else {
                          return null; // Skip rendering this item
                        }
                      })}
                    </ul>
                  </div>
                );
              } else {
                return null; // Skip rendering this position if no valid results
              }
            })}
          </div>
        )}        
      </div>
    </div>
  );
}

export default PredictionColombo;
