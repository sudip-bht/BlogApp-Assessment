from rest_framework import generics, status
from .serializer import RegisterSerializer, LoginSerializer
from rest_framework.response import Response
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .email_sender import Email_sender
from rest_framework.views import APIView


class RegisterView(generics.GenericAPIView):
    
    serializer_class = RegisterSerializer
    
    def post(self, request):
        user = request.data
        
        serializer = self.serializer_class(data = user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        user_data = serializer.data
        
        user = User.objects.get(email = user_data['email'])
        token = RefreshToken.for_user(user).access_token
        
        current_site = get_current_site(request).domain
        relativeLink = reverse('email-verify')
        absurl = 'http://'+current_site+relativeLink+'?token='+str(token)
        email_body = str(absurl)
        
        data = {
            'email_subject': 'Verify Your Email',
            'email_body':email_body,
            'to_email': user.email}
        Email_sender.send_email(data)
        
        return Response(user_data, status=status.HTTP_201_CREATED)
    
    
class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    def post(self, request):        
        serializer = self.serializer_class(data = request.data)
        serializer.is_valid(raise_exception= True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class VerifyEmail(generics.GenericAPIView):
    def get(self, request):
        token = request.GET.get('token')
        try:
            token_obj = AccessToken(token)
            user_id = token_obj['user_id']
            user = User.objects.get(id=user_id)
            
            if not user.is_verified:
                user.is_verified = True
                user.save()
            
            return Response({'email': 'Successfully Activated'}, status=status.HTTP_200_OK)
    
        except TokenError as e:
                    return Response({'error': 'Invalid or Expired Token'}, status=status.HTTP_400_BAD_REQUEST)
                
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token_obj = RefreshToken(refresh_token)
            access_token = token_obj.access_token
            return Response({"access": str(access_token)}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"error": "Invalid or Expired Token"}, status=status.HTTP_400_BAD_REQUEST)
