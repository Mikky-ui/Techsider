from django.test import TestCase, Client
from django.urls import reverse
from .models import Post, Category

import json

# Create your tests here.
class BlogAPITests(TestCase):
    def setUp(self):
        self.client = Client()
        self.category1 = Category.objects.create(name="Tech")
        self.category2 = Category.objects.create(name="Life")
        self.post1 = Post.objects.create(title="First Post", content="Hello World")
        self.post1.categories.add(self.category1)
        self.post2 = Post.objects.create(title="Second Post", content="Another Content")
        self.post2.categories.add(self.category2)

    def test_blog_posts_list(self):
        url = reverse('blog_posts')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['title'], "First Post")
        self.assertIn("Tech", data[0]['categories'])
        
    def test_create_post_success(self):
        url = reverse('create_post')
        payload = {
            "title": "New Blog",
            "content": "Some Content",
            "categories": ["Tech", "NewCat"]
        }
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data['title'], "New Blog")
        self.assertIn("Tech", data['categories'])
        self.assertIn("Newcat", data['categories'])  # Title-cased
        
    def test_create_post_missing_fields(self):
        url = reverse('create_post')
        payload = {"title": ""}
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_get_categories(self):
        url = reverse('category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['title'], "Tech")
    def test_update_post(self):
        url = reverse('update_post', args=[self.post1.id])
        payload = {
            "title": "Updated Title",
            "content": "Updated Content",
            "categories": ["Life"]
        }
        response = self.client.put(
            url,
            data=json.dumps(payload),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['title'], "Updated Title")
        self.assertIn("Life", data['categories'])

    def test_update_post_invalid_json(self):
        url = reverse('update_post', args=[self.post1.id])
        response = self.client.put(
            url,
            data="not a json",
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_delete_posts_invalid_format(self):
        url = reverse('delete_posts')
        response = self.client.delete(
            url,
            data=json.dumps({"ids": "notalist"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json()['status'])       