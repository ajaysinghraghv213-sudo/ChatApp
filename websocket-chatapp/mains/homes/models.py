from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    is_online=models.BooleanField(default=False)
    is_typing=models.BooleanField(default=False)
    profile_pic=models.ImageField(upload_to='profile/',blank=True)
    about = models.TextField()


class ChatModel(models.Model):
    sender=models.ForeignKey(User,on_delete=models.CASCADE,related_name='Sender')
    reciever=models.ForeignKey(User,on_delete=models.CASCADE,related_name='Reciever')
    file=models.FileField(upload_to='chat_files/',blank=True,null=True)
    message=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)
    is_created=models.BooleanField(default=False)
    is_read=models.BooleanField(default=False)
    is_deleted=models.BooleanField(default=False)
    is_updated=models.BooleanField(default=False)

    def __str__(self):
        return f'{self.sender}->{self.reciever}'

