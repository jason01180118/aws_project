import json
import boto3
from IPython.core.display import HTML

region = boto3.Session().region_name
s3_bucket = f"jumpstart-cache-prod-{region}"
key_prefix = "inference-notebook-assets"
s3 = boto3.client("s3")


def download_from_s3(key_filenames):
    for key_filename in key_filenames:
        s3.download_file(
            s3_bucket, f"{key_prefix}/{key_filename}", key_filename)


cat_jpg, dog_jpg = "cat.jpg", "dog.jpg"
download_from_s3(key_filenames=[cat_jpg, dog_jpg])

images = {}
test_jpg = "test.jpg"
with open(cat_jpg, 'rb') as file:
    images[cat_jpg] = file.read()
with open(dog_jpg, 'rb') as file:
    images[dog_jpg] = file.read()
with open(test_jpg, 'rb') as file:
    images[test_jpg] = file.read()


def query_endpoint(img):
    endpoint_name = 'jumpstart-dft-tf-ic-imagenet-mobilenet-v2-100-224-clas'
    client = boto3.client('runtime.sagemaker')
    print(client)
    response = client.invoke_endpoint(
        EndpointName=endpoint_name, ContentType='application/x-image', Body=img, Accept='application/json;verbose')
    return response


def parse_prediction(query_response):
    model_predictions = json.loads(query_response['Body'].read())
    predicted_label = model_predictions['predicted_label']
    labels = model_predictions['labels']
    probabilities = model_predictions['probabilities']
    return predicted_label, probabilities, labels


for filename, img in images.items():
    query_response = query_endpoint(img)
    predicted_label, probabilities, labels = parse_prediction(query_response)
 #   display(HTML(f'<img src={filename} alt={filename} align="left" style="width: 250px;"/>'
  #               f'<figcaption>Predicted Label is : {predicted_label}</figcaption>'))
    print(predicted_label)


def predict_top_k_labels(probabilities, labels, k):
    topk_prediction_ids = sorted(range(
        len(probabilities)), key=lambda index: probabilities[index], reverse=True)[:k]
    topk_class_labels = ", ".join([labels[id] for id in topk_prediction_ids])
    return topk_class_labels


for filename, img in images.items():
    model_predictions = query_endpoint(img)
    predicted_label, probabilities, labels = parse_prediction(
        model_predictions)
    top5_class_labels = predict_top_k_labels(probabilities, labels, 5)
 #   display(HTML(f'<img src={filename} alt={filename} align="left" style="width: 250px;"/>'
 #                f'<figcaption>Top-5 model predictions are: {top5_class_labels}</figcaption>'))
    print(top5_class_labels)
