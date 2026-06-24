from django.contrib import admin
from .models import ChatModel,User
# Register your models here.
admin.site.register(ChatModel)
admin.site.register(User)