from .models import User, Submission, Comment, Upvote
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["url", "id", "github_id", "created_at", "submission_set"]


class SubmissionListSerializer(serializers.HyperlinkedModelSerializer):
    upvote_count = serializers.IntegerField(read_only=True)
    upvoted = serializers.BooleanField(read_only=True)
    class Meta:
        model = Submission
        fields = [
            "url",
            "id",
            "title",
            "username",
            "js",
            "html",
            "css",
            "flagged",
            "updated_at",
            "created_at",
            "upvote_count",
            "upvoted",
        ]


class SubmissionCreateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Submission
        fields = [
            "url",
            "id",
            "title",
            "js",
            "html",
            "css",
            "updated_at",
            "created_at",
        ]


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = [
            "url",
            "user",
            "body",
            "submission",
            "parent",
            "updated_at",
            "created_at",
        ]


class UpvoteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Upvote
        fields = ["url", "user", "submission", "created_at"]
