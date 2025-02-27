from django.urls import path

from . import views

urlpatterns = [
    path('blog-list/', views.GetBlogs.as_view(), name='get_blogs'),
    path('self-blog-list/', views.GetSelfBlogs.as_view(), name='get_self_blogs'),
    path('create/', views.CreateBlog.as_view(), name='create_blog'),
    path('update/<int:id>/', views.BlogUpdateView.as_view(), name='blog_update'), 

]