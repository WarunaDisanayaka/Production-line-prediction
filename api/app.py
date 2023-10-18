from flask import Flask, request, jsonify
from joblib import load
import pandas as pd

app = Flask(__name__)

# Load the trained model
model_filename = 'random_forest_model.joblib'
clf = load(model_filename)

# Load the LabelEncoder used during training for 'Product Type'
le_product = load('product_type_label_encoder.joblib')

# Load the LabelEncoder used during training for 'Module'
le_module = load('module_label_encoder.joblib')

# Load the data to calculate Total SMV
data = pd.read_csv('new_dataset_filled.csv')  # Replace with the actual path to your dataset file

@app.route('/predict', methods=['POST'])
def predict_module():
    data = request.get_json()
    product_type = data['product_type']

    # Encode the 'Product Type' using the LabelEncoder
    product_type_encoded = le_product.transform([product_type])[0]

    # Create a sample data point to predict
    sample_data = pd.DataFrame({'Product Type': [product_type_encoded]})

    # Predict the module
    predicted_module = clf.predict(sample_data)

    # Inverse transform to get the module name
    predicted_module = le_module.inverse_transform(predicted_module)

    # Calculate Total SMV for the predicted module
    predicted_module_name = predicted_module[0]

    # Replace 'Module' with the actual column name 'Module'
    total_smv_for_module = data[data['Module'] == predicted_module_name]['Total SMV'].mean()

    return jsonify({'predicted_module': predicted_module_name, 'total_smv': total_smv_for_module})

if __name__ == '__main__':
    app.run(debug=True)
