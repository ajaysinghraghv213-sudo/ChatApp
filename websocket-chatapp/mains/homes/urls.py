from django.contrib import admin
from django.urls import path
from homes import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/',views.Registeration.as_view(),name='register'),
    path('login/',views.LoginView.as_view(),name='login'),
    path('users/',views.UserView.as_view(),name='users'),
    path('refresh/token/',TokenRefreshView.as_view(),name='refreshtoken'),
    path('chats/<int:id>/',views.ChatDetailView.as_view(),name='chats'),
    path('logout/',views.LogoutView.as_view(),name='logout'),
    path('user/<int:pk>/',views.UserDetailView.as_view(),name='userdetail'),
    path('me/',views.CurrentUserView.as_view(),name='currentUser')

  
    

]
