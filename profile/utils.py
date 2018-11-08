from authentication.models import User
from venue.models import Image

def is_liked(username, image_id):
    """
    Checks if a particular user given by username likes an image given by the image id
    :return: True if user likes image, False otherwise
    """
    return image_id in User.objects.get(username=username).liked_images