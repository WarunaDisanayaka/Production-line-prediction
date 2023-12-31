from flask import Flask, request, jsonify
from joblib import load
import pandas as pd
from flask_cors import CORS  # Import CORS from flask_cors

app = Flask(__name__)
CORS(app, origins="*")

# Load the trained model
model_filename = 'random_forest_model.joblib'
clf = load(model_filename)

# Load the LabelEncoders used during training
le_product = load('product_type_label_encoder.joblib')
le_module = load('module_label_encoder.joblib')

# Load the dataset
data_set = pd.read_csv('new_dataset_filled.csv') 


@app.route('/predict', methods=['POST'])
def predict_module():
    data = request.get_json()
    print("Received data:", data)

    product_type = data['product_type']

    # Encode the 'Product Type' using the LabelEncoder
    product_type_encoded = le_product.transform([product_type])[0]

    # Create a sample data point to predict
    sample_data = pd.DataFrame({'Product Type': [product_type_encoded]})

    # Predict the module
    predicted_module = clf.predict(sample_data)

    # Inverse transform to get the module name
    predicted_module_name = le_module.inverse_transform(predicted_module)[0]

    # Initialize most_common_defect_name as None
    most_common_defect_name = None

    # Find Total SMV for the predicted module
    total_smv_for_module = data_set[data_set['Module'] == predicted_module_name]['Total SMV'].mean()

    # Find MAX and MIN SMV for the predicted module
    max_smv_for_module = data_set[data_set['Module'] == predicted_module_name]['Total SMV'].max()
    min_smv_for_module = data_set[data_set['Module'] == predicted_module_name]['Total SMV'].min()

    # Filter the dataset to include only rows with the predicted module
    predicted_module_data = data_set[data_set['Module'] == predicted_module_name]

    # Check if there are any records for the predicted module
    if not predicted_module_data.empty:
        # Check if there are any Defect Names available for the predicted module
        if 'Defect Name' in predicted_module_data.columns:
            # Use value_counts to count the occurrences of each Defect Name
            defect_name_counts = predicted_module_data['Defect Name'].value_counts()

            if not defect_name_counts.empty:
                # Get the most common Defect Name
                most_common_defect_name = defect_name_counts.idxmax()
                print(f'Most Common Defect Name for Predicted Module: {most_common_defect_name}')
            else:
                print('No Defect Names available for the predicted module.')
        else:
            print('No "Defect Name" column available for the predicted module.')
    else:
        print('No records found for the predicted module.')

    return jsonify({
        'predicted_module': predicted_module_name,
        'total_smv': total_smv_for_module,
        'max_smv': max_smv_for_module,
        'min_smv': min_smv_for_module,
        'most_common_defect_name': most_common_defect_name
    })

@app.after_request
def set_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'  # Allow Content-Type header
    return response

if __name__ == '__main__':
    app.run(debug=True)
