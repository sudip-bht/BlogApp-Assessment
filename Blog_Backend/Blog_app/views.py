from django.shortcuts import render
from User_auth.models import User
from .models import Blog
# Create your views here.
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import *
from rest_framework.parsers import MultiPartParser
from .pagination import BlogPagination


class CreateBlog(generics.GenericAPIView):
    def post(self, request):
        user = User.objects.get(email = request.user)
        if user:
            if user.is_verified:
                serializer = BlogSerializer(data=request.data)
                print(user)
                if serializer.is_valid(raise_exception=ValueError):
                    serializer.save(created_by = user)
                    return Response(
                            serializer.data,
                            status=status.HTTP_201_CREATED,
                        )
                
                return Response(
                        {
                            "error":True,
                            "error_msg": serializer.error_messages,
                        },
                        status=status.HTTP_400_BAD_REQUEST
                        )
            return Response({
            "error":"Verify Email Before Posting"
            })
            
        return Response({
            "error":True,
            "message":"Please Login First"
        },
            status=status.HTTP_401_UNAUTHORIZED
        )
                


class GetBlogs(APIView):
    parser_classes = [MultiPartParser]
    pagination_class = BlogPagination
     
    def get(self, request):
        
        user = request.user
        if user:
            blogs = Blog.objects.all().order_by('-created_at')
            paginator = self.pagination_class()
            paginated_blogs = paginator.paginate_queryset(blogs, request)
            
            serializer = BlogSerializer(paginated_blogs, many=True)


            return paginator.get_paginated_response(serializer.data)

        
        return Response({
            "error":True,
            "message":"Please Login First"
        },
            status=status.HTTP_401_UNAUTHORIZED
        )
        

class GetSelfBlogs(APIView):
    parser_classes = [MultiPartParser]
    pagination_class = BlogPagination     

    def get(self, request): 
        user = request.user
        if user:
            blogs = Blog.objects.filter(created_by = user)
            paginator = self.pagination_class()
            paginated_blogs = paginator.paginate_queryset(blogs, request)
            serializer = BlogSerializer(paginated_blogs, many=True)
            return paginator.get_paginated_response(serializer.data)
           
            
        return Response({
            "error":True,
            "message":"Please Login First"
        },
            status=status.HTTP_401_UNAUTHORIZED
        )


class BlogUpdateView(APIView): 

    def put(self, request, id):
        user = request.user
        if user:
            blog = get_blog(id)
            if not blog:
                return Response(
                    {"message": "Post Not Found"},
                    status=status.HTTP_404_NOT_FOUND)
            
            if blog.created_by != request.user:
                return Response(
                    {"error": True, "error_msg": "You do not have permission to perform this action."},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            serializer = BlogUpdateSerializer(blog, data=request.data)
        
            if serializer.is_valid(raise_exception = ValueError):
                serializer.save()
                return Response(serializer.data)
            return Response(
                    {
                        "error":True,
                        "error_msg": serializer.error_messages,
                    },
                    status=status.HTTP_400_BAD_REQUEST
                    )
        return Response({
            "error":True,
            "message":"Please Login First"
        },
            status=status.HTTP_401_UNAUTHORIZED
        )

    def delete(self, request, id):
        user = request.user
        if user:
            blog = get_blog(id)
            if not blog:
                return Response(
                        {
                            "error": True,
                            "error_msg": "Blog not found"
                        },
                        status=status.HTTP_404_NOT_FOUND
                    )
                
            if blog.created_by != request.user:
                return Response(
                    {"error": True, "error_msg": "You do not have permission to perform this action."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            blog.delete()
            return Response({"success":"post deleted"},
                    status = status.HTTP_200_OK
                )
        return Response({
            "error":True,
            "message":"Please Login First"
        },
            status=status.HTTP_401_UNAUTHORIZED
        )
      
      
def get_blog(id):
    try:
        blog = Blog.objects.get(id = id)
    except Blog.DoesNotExist:
        return False
    return blog