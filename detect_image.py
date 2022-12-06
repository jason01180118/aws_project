import json
import boto3
from IPython.core.display import HTML


def query_endpoint(img):
    endpoint_name = 'jumpstart-dft-tf-ic-imagenet-mobilenet-v2-100-224-clas'
    client = boto3.client('runtime.sagemaker', region_name='us-east-1')
    response = client.invoke_endpoint(
        EndpointName=endpoint_name, ContentType='application/x-image', Body=img, Accept='application/json;verbose')
    return response


def parse_prediction(query_response):
    model_predictions = json.loads(query_response['Body'].read())
    predicted_label = model_predictions['predicted_label']
    labels = model_predictions['labels']
    probabilities = model_predictions['probabilities']
    return predicted_label, probabilities, labels


def detect_one_label(file):
    images = {}
    images[file] = file.read()
    for filename, img in images.items():
        query_response = query_endpoint(img)
        predicted_label, probabilities, labels = parse_prediction(
            query_response)
    #   display(HTML(f'<img src={filename} alt={filename} align="left" style="width: 250px;"/>'
    #               f'<figcaption>Predicted Label is : {predicted_label}</figcaption>'))
    return predicted_label
