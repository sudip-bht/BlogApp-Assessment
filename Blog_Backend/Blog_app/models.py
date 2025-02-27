from django.db import models
from datetime import datetime
from User_auth.models import User


# Create your models here.
class Blog(models.Model):
    title = models.CharField(max_length=100, null=False)
    content = models.CharField(max_length=1000000)
    created_at = models.DateTimeField(default=datetime.now, blank= True)
    created_by = models.ForeignKey(User,on_delete = models.CASCADE,blank=False, related_name='created_by')
    liked_by = models.ManyToManyField(User, blank=True, related_name='liked_by')
    
    def created_by_user(self):
        return self.created_by.username
    
    def like_count(self):
        return len(self.liked_by.user.all())
    
    def __str__(self):
        return f"{self.title[:30]} ..."