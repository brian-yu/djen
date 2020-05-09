import os

from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token
import requests
import shortuuid

from .managers import UserManager

# Create your models here.
class User(AbstractUser):
    username = None
    github_id = models.CharField(max_length=39, unique=True)
    password = None

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "github_id"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def set_password(self, _):
        pass

    def set_unusable_password(self):
        pass

    def check_password(self, access_token):
        user_info = User.get_github_user_info(access_token)
        try:
            return user_info["login"] == self.github_id
        except:
            return False

    @staticmethod
    def get_token(oauth_code):
        user = User.authorize(oauth_code)
        if not user:
            return None  # is this the best return type?
        token, _ = Token.objects.get_or_create(user=user)
        return token, user

    @staticmethod
    def get_github_access_token(oauth_code):
        payload = {
            "client_id": os.environ["GITHUB_CLIENT_ID"],
            "client_secret": os.environ["GITHUB_CLIENT_SECRET"],
            "code": oauth_code,
        }
        res = requests.post(
            "https://github.com/login/oauth/access_token",
            data=payload,
            headers={"Accept": "application/json"},
        )
        return res.json()["access_token"]

    @staticmethod
    def get_github_user_info(access_token):
        res = requests.get(
            "https://api.github.com/user",
            headers={"Authorization": f"token {access_token}"},
        )
        return res.json()

    @staticmethod
    def authorize(oauth_code):
        access_token = User.get_github_access_token(oauth_code)
        user_info = User.get_github_user_info(access_token)
        github_id = user_info["login"]

        user, created = User.objects.get_or_create(github_id=github_id)
        return user


class Submission(models.Model):
    id = models.CharField(
        primary_key=True, default=shortuuid.uuid, editable=False, max_length=22
    )
    title = models.CharField(max_length=100)
    js = models.TextField(blank=True)
    html = models.TextField(blank=True)
    css = models.TextField(blank=True)
    flagged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.ForeignKey("User", on_delete=models.CASCADE)

    def upvote_count(self):
        return self.upvote_set.count()
    
    def username(self):
        return self.user.github_id

    def render(self):
        return f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>{ self.title } - djen</title>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.js"></script>
                <script src="https://unpkg.com/css-doodle@0.8.5/css-doodle.min.js"></script>
                <style>
                { self.css }
                </style>
            </head>
            <body style="padding: 0; margin: 0; overflow: hidden;">
                { self.html }
                <script>{ self.js }</script>
            </body>
            </html>
        """.encode(
            "utf-8"
        ).decode(
            "unicode_escape"
        )


class Comment(models.Model):
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.ForeignKey("User", on_delete=models.CASCADE)
    submission = models.ForeignKey("Submission", on_delete=models.CASCADE)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True)


class Upvote(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey("User", on_delete=models.CASCADE)
    submission = models.ForeignKey("Submission", on_delete=models.CASCADE)
