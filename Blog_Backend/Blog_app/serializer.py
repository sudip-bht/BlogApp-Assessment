from rest_framework import serializers
from .models import Blog
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed



class BlogSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required = True)
    content = serializers.CharField(required = True)
    
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'created_by', 'created_at', 'like_count']


class BlogUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['title','content','created_at']