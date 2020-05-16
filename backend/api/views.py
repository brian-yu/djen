import json

from django.db.models import (
    Count,
    ExpressionWrapper,
    BooleanField,
    FloatField,
    Value,
    Func,
    Exists,
    OuterRef,
)
from django.db.models.functions import Power
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, action, renderer_classes
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.renderers import TemplateHTMLRenderer, StaticHTMLRenderer
from rest_framework.response import Response

from .models import User, Submission, Comment, Upvote
from .permissions import IsUserOrReadOnly, IsUser, IsOwner, ReadOnly
from .serializers import (
    UserSerializer,
    SubmissionListSerializer,
    SubmissionCreateSerializer,
    CommentSerializer,
    UpvoteSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsUserOrReadOnly]
    authentication_classes = [TokenAuthentication]


class SubmissionsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = Submission.objects.all()
    permission_classes = [IsUserOrReadOnly]
    authentication_classes = [TokenAuthentication]
    pagination_class = SubmissionsSetPagination

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        # Add upvote count.
        queryset = Submission.objects.annotate(upvote_count=Count("upvote"))

        user_pk = self.request.user.pk if self.request.user.is_authenticated else None
        if self.request.user.is_authenticated:
            queryset = queryset.annotate(
                upvoted=Exists(
                    Upvote.objects.filter(
                        user=self.request.user.pk, submission=OuterRef("pk"),
                    )
                )
            )
        else:
            queryset = queryset.annotate(upvoted=Value(False, BooleanField()))

        # Filter by username if required.
        username = self.request.query_params.get("username", None)
        if username is not None:
            queryset = queryset.filter(user__github_id=username)

        ordering = self.request.query_params.get("ordering", None)
        if ordering == "hot":
            # Hotness algorithm: https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d
            gravity = 1.8

            class Age(Func):
                template = "(EXTRACT(EPOCH FROM current_timestamp) - EXTRACT(EPOCH  FROM %(expressions)s))/3600"

            queryset = queryset.annotate(
                hotness=ExpressionWrapper(
                    F("upvote_count")
                    / Power(Age("created_at", output_field=FloatField()), gravity),
                    output_field=FloatField(),
                )
            )
            queryset = queryset.order_by("-hotness")

        elif ordering == "top":
            queryset = queryset.order_by("-upvote_count")
        elif ordering == "new":
            queryset = queryset.order_by("-created_at")
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "list":
            return SubmissionListSerializer
        if self.action == "retrieve":
            return SubmissionListSerializer
        # create/destroy/update
        return SubmissionCreateSerializer

    @action(detail=True, methods=["get"], renderer_classes=[StaticHTMLRenderer])
    @xframe_options_exempt
    def render(self, request, pk=None):
        submission = self.get_object()
        return Response(submission.render())

    @action(detail=True, methods=["get"])
    def upvote(self, request, pk=None):
        submission = self.get_object()
        print(self.request.user)
        if self.request.user.is_authenticated:
            upvote = Upvote.objects.create(
                submission=submission, user=self.request.user
            )
            return Response({"status": "upvoted"})
        return Response({}, status.HTTP_401_UNAUTHORIZED)

    @action(detail=True, methods=["get"])
    def unvote(self, request, pk=None):
        submission = self.get_object()
        if self.request.user.is_authenticated:
            Upvote.objects.filter(
                submission=submission, user=self.request.user
            ).delete()
            return Response({"status": "unvoted"})

        return Response({}, status.HTTP_401_UNAUTHORIZED)

    @action(detail=False)
    def recent_users(self, request):
        recent_users = User.objects.all().order_by("-last_login")

        page = self.paginate_queryset(recent_users)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(recent_users, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsUserOrReadOnly]
    authentication_classes = [TokenAuthentication]


class UpvoteViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = Upvote.objects.all()
    serializer_class = UpvoteSerializer
    permission_classes = [IsUserOrReadOnly]
    authentication_classes = [TokenAuthentication]


@api_view(["POST"])
@csrf_exempt
def get_auth_token(request, format=None):
    try:
        oauth_code = request.data["code"]
        token, user = User.get_token(oauth_code)
        return Response({"token": token.key, "github_id": user.github_id})
    except Exception as e:
        print(e)

    return Response({"message": "Could not authenticate."}, status=500)
