from .models import ChatModel,User
from rest_framework import serializers



class ChatSerialzer(serializers.ModelSerializer):
    sender=serializers.CharField(source='sender.username',read_only=True)
    reciever=serializers.CharField(source='reciever.username',read_only=True)
    class Meta:
        model=ChatModel
        fields='__all__'
        read_only_fields=['sender','reciever']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['username','email','password']
    def create(self,validated_data):
        print("validated_data", validated_data)
        user=User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )    
        print(user)
        return user        
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','profile_pic','about','is_online','is_typing']    
    
