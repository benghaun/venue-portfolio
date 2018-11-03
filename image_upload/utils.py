from google.cloud import vision
from google.cloud.vision import types

client = vision.ImageAnnotatorClient()

def get_tags(file):
    """
    Gets the tags returned by the Google Image Vision API
    :param file: Image file, uploaded by user
    :return: list of tags
    """
    image = types.Image(content=file)
    response = client.label_detection(image=image)
    labels = response.label_annotations
    tags = []
    landscape_score = 0
    landscape_labels = ["sky", "cloud", "grass", "water", "biome", "mountain"]
    fantasy_labels = ['mythology', 'mythical creature', 'supernatural creature']
    for label in labels:
        if label.description == 'portrait':
            tags.append("portrait")

        if label.description in landscape_labels:
            landscape_score += label.score

        if label.description == "fictional character":
            tags.append("character")

        if label.description in fantasy_labels and "fantasy" not in tags:
            tags.append("fantasy")
    if landscape_score >= 1.75:
        tags.append("landscape")
    return tags
