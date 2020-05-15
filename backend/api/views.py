import json

from django.http import JsonResponse
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, action, renderer_classes
from rest_framework.renderers import TemplateHTMLRenderer, StaticHTMLRenderer
from rest_framework.response import Response

from .models import User, Submission, Comment, Upvote
from .permissions import IsOwnerOrReadOnly, IsUserOrReadOnly, IsUser, IsOwner, ReadOnly
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


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    queryset = Submission.objects.all()
    permission_classes = [IsUserOrReadOnly]
    authentication_classes = [TokenAuthentication]

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
        # return Response(
        #     {
        #         'html': submission.html,
        #         'js': submission.js,
        #         'css': submission.css,
        #     },
        #     template_name="sandbox.html"
        # )
        return Response(submission.render())

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
