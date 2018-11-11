from django.shortcuts import HttpResponse, render
from django.contrib.auth.decorators import login_required
from venue.models import User
from .models import Message


@login_required()
def send_message(request):
    sender_username = request.user.username
    recipient_username = request.POST.get("recipient")
    subject = request.POST.get("subject", "No Subject")
    content = request.POST.get("content")
    if recipient_username is not None and sender_username is not None and content is not None:
        try:
            sender = User.objects.get(username=sender_username)
            recipient = User.objects.get(username__iexact=recipient_username)
        except User.DoesNotExist:
            return HttpResponse(status=400, content="User does not exist")
    else:
        return HttpResponse(status=400, content="Missing parameters")
    message = Message(sender=sender, recipient=recipient, subject=subject, content=content)
    message.save()
    return HttpResponse(status=200, content="Message sent")


@login_required()
def message_view(request):
    return render(request, 'messaging/messaging.html')

@login_required()
def inbox(request):
    inbox = User.objects.get(username=request.user.username).inbox.all()
    output = []
    for message in inbox:
        output.append(message.__str__())
    return render(request, 'messaging/inbox.html', {'messages': output})
