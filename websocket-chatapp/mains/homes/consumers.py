from channels.layers import get_channel_layer
from channels.generic.websocket import WebsocketConsumer
from .models import *
from asgiref.sync import async_to_sync,sync_to_async
import json
class UserMessage(WebsocketConsumer):
    def connect(self,):
    
        user_id=self.scope['user'].id
        user=self.scope['user']
        print('user soxket',user)
        user.is_online = True
        user.save()
        other_user_id=int(self.scope['url_route']['kwargs']['id'])
    
        self.room_name=(
            f'{max(user_id,other_user_id)}_'
            f'{min(user_id,other_user_id)}'
        )
        self.group_name=f'chat{self.room_name}'
        print(self.group_name)
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
            

        )
        self.accept()
        print('connected')

    def  receive(self,text_data):
        data = json.loads(text_data)
        if data['type']=='message':
         data=json.loads(text_data)
         print('recived data',data)
         user_id=self.scope['user'].id
         other_user_id=self.scope['url_route']['kwargs']['id']
         message=data['message']
         chat=ChatModel.objects.create(
            sender_id=user_id,
            reciever_id=other_user_id,
            message=data['message']

         )
         async_to_sync(self.channel_layer.group_send)(
            self.group_name,{
               'type':'chat_message',
               'id':chat.id,
               'message':message,
               'sender':self.scope['user'].username

            }
         )

        if data['type']=='read':
            message_id=data['message_id']
            chat=ChatModel.objects.get(id=message_id)
            chat.is_read=True
            chat.save()
            async_to_sync(self.channel_layer.group_send)(
               self.group_name,{
                  'type':'read_message',
                  'message_id':message_id
               }
            )
        if data['type']=='delete':
           print('delete message id',data['message_id'])
           message_id=data['message_id'] 
           chat = ChatModel.objects.get(id=message_id)
           chat.delete()
           async_to_sync(self.channel_layer.group_send)(
              self.group_name,{
                 'type':'delete_chat',
                 'message_id':message_id
              }
           )

        if data['type']=='edit':
           print('recived data',data)
           message_id=data['message_id']
           chat=ChatModel.objects.get(id=message_id)
           chat.message=data['message']
           chat.is_updated = True 
           chat.save()
           async_to_sync(self.channel_layer.group_send)(
              self.group_name,{
                 'type':'edit_message',
                 'message_id':chat.id,
                 'message':chat.message,
                 'is_updated':True

              }
           )


        if data['type']=='typing':
           print('recieved_data',data)
           async_to_sync(self.channel_layer.group_send)(
              self.group_name,{
                 'type':'typing_user',
                  'username':self.scope['user'].username,
                  'is_typing':data['is_typing']
              }
           )
           

             


    def chat_message(self,event):
       self.send(text_data=json.dumps({
          'type':'message',
          'sender':event['sender'],
          'id':event['id'],
          'message':event['message']

       }))

    def read_message(self,event):
       self.send(text_data=json.dumps({
          'type':'read',
          'message_id':event['message_id'],
          'is_read':True
       }))   
    def delete_chat(self,event):
       self.send(text_data=json.dumps({
          'type':'delete',
          'message_id':event['message_id'],
           'is_deleted':True            
             }))   
       

    def edit_message(self,event):
       self.send(text_data=json.dumps({
          'type':'edit',
          'message':event['message'],
          'is_updated':event['is_updated'],
          'message_id':event['message_id']
       }))   

    def disconnect(self,close_code):
       user=self.scope['user']
       user.is_online=False

       user.save()   

    def typing_user(self,event):
       self.send(text_data=json.dumps({
          'type':'typing',
           'username':event['username'],
           'is_typing':event['is_typing']
       }))   






        
