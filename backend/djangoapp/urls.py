from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('api/blogposts/', views.blog_posts, name='blog_posts'),
    path('api/create_post/', views.create_post, name='create_post'),
    path('api/categories/', views.get_categories, name='category-list'),
    path('api/posts/delete/', views.delete_posts, name='delete_posts'),
    path('api/posts/<int:post_id>/', views.update_post, name='update_post'),
]