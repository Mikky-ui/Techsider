from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('api/blogposts/', views.blog_posts, name='blog_posts'),
]