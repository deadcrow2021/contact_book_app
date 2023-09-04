from django.urls import path
from . import views

urlpatterns = [
	path('', views.apiOverview, name="api-overview"),
	path('contact_list/', views.contact_list, name="contact-list"),
	path('contact_search/', views.contact_search, name="contact-search"),
	path('contact_detail/<str:pk>/', views.contact_detail, name="contact-detail"),
	path('contact_create/', views.contact_create, name="contact-create"),
	path('contact_update/<str:pk>/', views.contact_update, name="contact-update"),
	path('contact_delete/<str:pk>/', views.contact_delete, name="contact-delete"),
]