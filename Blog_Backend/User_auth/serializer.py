from rest_framework import serializers
from .models import User
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length = 68, min_length = 8, write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password']
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length = 255, min_length = 3)
    password = serializers.CharField(max_length = 68, min_length = 6, write_only=True)
    username = serializers.CharField(max_length = 255, min_length = 3, read_only = True)

    class Meta:
        model = User
        fields = ['email', 'password', 'username']
        
    def validate(self, attrs):
        email = attrs.get('email', '')
        print(email)
        password = attrs.get('password', '')
        print(password)
        
        user = auth.authenticate(email=email, password=password)
        
        if not user:
            raise serializers.AuthenticationFailed("Invalid credentials, Try again")
        
        if not user.is_verified:
            raise AuthenticationFailed('Email not verified')
        
        return{
            'email': user.email,
            'username': user.username,
        }