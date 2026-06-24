from django.shortcuts import render
import django_filters
from .serializers import ChatSerialzer,RegisterSerializer,UserSerializer

from rest_framework import mixins,generics
from rest_framework.response import Response
from .models import ChatModel,User
from rest_framework.views import APIView
from django.db.models import Q
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser,FormParser

# Create your views here.

class UserView(mixins.ListModelMixin,mixins.CreateModelMixin,generics.GenericAPIView):
    serializer_class=UserSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = {
    'username': ['icontains']
}


    def get_queryset(self):
        print("Current user:", self.request.user)
        return User.objects.exclude(id=self.request.user.id)
    def get(self,request):
        return self.list(request)
    def post(self,request):
        return self.create(request)
    

class UserDetailView(mixins.DestroyModelMixin,mixins.RetrieveModelMixin,mixins.UpdateModelMixin,generics.GenericAPIView):
    serializer_class=UserSerializer
    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id)

    def get(self,request,pk):
        return self.retrieve(request,pk)
    def put(self,request,pk):
        return self.update(request,pk)
    def delete(self,request,pk):
        return self.destroy(request,pk)    
    
class CurrentUserView(mixins.RetrieveModelMixin,mixins.DestroyModelMixin,mixins.UpdateModelMixin,generics.GenericAPIView):
    serializer_class=UserSerializer
    parser_classes=[MultiPartParser,FormParser]


    def get_object(self):
        return self.request.user
    def get(self,request):
        return self.retrieve(request)
    def put(self,request):
        return self.update(request,partial=True)
    def delete(self,request):
        return self.destroy(request)    
        
class ChatDetailView(mixins.CreateModelMixin,mixins.ListModelMixin,generics.GenericAPIView):
    serializer_class=ChatSerialzer
    parser_classes=[MultiPartParser,FormParser]

    def get_queryset(self):
        print(self.request.user)
        logged_user=self.request.user
        reciever_id=self.kwargs.get('id')
        return ChatModel.objects.filter(Q(sender=logged_user,reciever_id=reciever_id)|Q(sender_id=reciever_id,reciever=logged_user)).order_by('id')
    def perform_create(self,serializer):
         logged_user=self.request.user
         reciever_id=self.kwargs.get('id')
        
         serializer.save( sender=logged_user,
    reciever_id=reciever_id)
    def get(self,request,id):
        return self.list(request,id)
    def post(self,request,id):
        return self.create(request)
    
class Registeration(APIView):
    def get(self,request):
        return Response({'message':'please signup here !'})
    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'user created successfully'})
        return Response(serializer.errors)
    
class LoginView(APIView):
    def get(self,request):
        return Response({"message":'please login here !'})
    def post(self,request):
        username=request.data.get('username') 
        password=request.data.get('password')
        user=authenticate(username=username,password=password)
        if user:
            refresh=RefreshToken.for_user(user)  
            return Response({'refresh':str(refresh),'access':str(refresh.access_token),'username':user.username,'message':'user logged in successfullyy !'})
        return Response({'message':'user credential are wrong!'})
    

class LogoutView(APIView):
    def post(self,request):
        try:
         refresh_token = request.data['refresh']
         token = RefreshToken(refresh_token)
         token.blacklist()
         return Response({'message':'logged out!'})
        except Exception as e :
            return Response({'message':'something went wrong !'})
        
    


