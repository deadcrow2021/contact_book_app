from django.urls import path
from . import views

urlpatterns = [
	path('', views.list, name="list"),
    path('register', views.register_user, name='register'),
]