from django.shortcuts import render

# Create your views here.
from .models import Post, Comment
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt

def blog_posts(request):

    posts = Post.objects.all()
    blog_posts = []

    for post in posts:
        categories = list(post.categories.values_list('name', flat=True))
        blog_posts.append({
            'id': post.id,
            'title': post.title,
            'content': post.body,
            'categories': categories
        })

    return JsonResponse(blog_posts, safe=False)

def blog_index(request):
    posts = Post.objects.all().order_by("-created_on")
    context = {
        "posts": posts,
    }
    
def blog_category(request, category):
    posts = Post.objects.filter(
        categories__name__contains=category
    ).order_by("-created_on")
    context = {
        "category": category,
        "posts": posts,
    }
    return render(request, "blog/category.html", context)
    
def blog_detail(request, pk):
    post = Post.objects.get(pk=pk)
    comments = Comment.objects.filter(post=post)
    context = {
        "post": post,
        "comments": comments,
    }

    return render(request, "blog/detail.html", context)