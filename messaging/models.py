from django.db import models
from authentication.models import User


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="outbox")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="inbox")
    subject = models.TextField()
    content = models.TextField()
    read = models.BooleanField(default=False)

    def __str__(self):
        output = "------- Message ------\n"
        output += "From: " + self.sender.username + "\n"
        output += "To: " + self.recipient.username + "\n"
        output += "\n"
        output += self.content
        return output
