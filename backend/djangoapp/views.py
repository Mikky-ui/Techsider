from django.shortcuts import render

# Create your views here.
from .models import Post, Comment, Category
from django.http import JsonResponse, HttpResponseBadRequest
import json
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404

# --- API Views ---

@csrf_exempt
@require_http_methods(["GET"])
def blog_posts(request):
    """
    List all blog posts with their categories.
    """

    posts = Post.objects.all()
    blog_posts = []

    for post in posts:
        categories = list(post.categories.values_list('name', flat=True))
        blog_posts.append({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'categories': categories
        })

    return JsonResponse(blog_posts, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def create_post(request):
    """
    Create a new blog post with categories.
    """
    
    if request.method != 'POST':
        return JsonResponse(
            {'error': 'Method not allowed'}, 
            status=405
        )

    try:
        # Parse JSON data
        data = json.loads(request.body)
        title = data.get('title')
        content = data.get('content')
        category_names = data.get('categories', [])

        # Validate required fields
        if not title or not content:
            return JsonResponse(
                {'error': 'Title and content are required'},
                status=400
            )

        with transaction.atomic():
            # Create post
            post = Post.objects.create(
                title=title,
                content=content
            )

            # Process categories
            created_categories = []
            for name in category_names:
                name = name.strip().title()
                if name:  # Skip empty names
                    category, created = Category.objects.get_or_create(name=name)
                    post.categories.add(category)
                    if created:
                        created_categories.append(name)

        return JsonResponse({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'created_on': post.created_on.isoformat(),
            'categories': list(post.categories.values_list('name', flat=True)),
            'new_categories_created': created_categories
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'Invalid JSON format'},
            status=400
        )
    except ValidationError as e:
        return JsonResponse(
            {'error': str(e)},
            status=400
        )
    except Exception as e:
        return JsonResponse(
            {'error': f'Server error: {str(e)}'},
            status=500
        )

@csrf_exempt
@require_http_methods(["GET"])
def get_categories(request):
    """
    List all categories.
    """
    if request.method != 'GET':
        return JsonResponse(
            {'error': 'Method not allowed'},
            status=405
        )

    categories = Category.objects.all()
    category_list = [{'id': category.id, 'title': category.name} for category in categories]

    return JsonResponse(category_list, safe=False)

@csrf_exempt
@require_http_methods(["PUT"])
def update_post(request, post_id):
    """
    Update a blog post and its categories.
    """
    
    if request.method != 'PUT':
        return JsonResponse(
            {'error': 'Method not allowed'},
            status=405
        )

    try:
        data = json.loads(request.body)
        post = get_object_or_404(Post, pk=post_id)

        with transaction.atomic():
            # Update basic fields
            if 'title' in data:
                post.title = data['title']
            if 'content' in data:
                post.content = data['content']
            post.save()

            # Process categories if included
            if 'categories' in data:
                current_categories = set(post.categories.values_list('name', flat=True))
                new_categories = set(c.strip().title() for c in data['categories'] if c.strip())
                
                # Remove deselected categories from post (without deleting categories)
                to_remove = current_categories - new_categories
                if to_remove:
                    post.categories.remove(*post.categories.filter(name__in=to_remove))
                
                # Add new categories
                for name in new_categories:
                    category, _ = Category.objects.get_or_create(name=name)
                    post.categories.add(category)

        return JsonResponse({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'last_modified': post.last_modified.isoformat(),
            'categories': list(post.categories.values_list('name', flat=True))
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_posts(request):
    """
    Delete multiple posts by IDs.
    """
    
    try:
        # Parse JSON body
        data = json.loads(request.body)
        post_ids = data.get('ids', [])
        
        # Validate IDs
        if not isinstance(post_ids, list):
            return JsonResponse({
                'status': 'error',
                'message': 'IDs must be provided as an array'
            }, status=400)
        
        # Convert to integers
        post_ids = [int(id) for id in post_ids]
        
        # Delete posts
        deleted_count, _ = Post.objects.filter(id__in=post_ids).delete()
            
        return JsonResponse({
            'status': 'success',
            'message': f'Deleted {deleted_count} post(s)',
            'deleted_count': deleted_count
        }, status=200)
        
    except (ValueError, TypeError) as e:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid ID format'
        }, status=400)
    
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

# --- HTML Views ---

def blog_index(request):
    """
    Render the blog index page.
    """
    posts = Post.objects.all().order_by("-created_on")
    context = {
        "posts": posts,
    }
    
def blog_category(request, category):
    """
    Render posts for a specific category.
    """

    posts = Post.objects.filter(
        categories__name__contains=category
    ).order_by("-created_on")
    context = {
        "category": category,
        "posts": posts,
    }
    return render(request, "blog/category.html", context)
    
def blog_detail(request, pk):
    """
    Render the detail page for a single post.
    """
    
    post = Post.objects.get(pk=pk)
    comments = Comment.objects.filter(post=post)
    context = {
        "post": post,
        "comments": comments,
    }

    return render(request, "blog/detail.html", context)