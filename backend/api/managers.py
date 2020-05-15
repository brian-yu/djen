import os

import requests
from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, password=None, **extra_fields):
        """
        Create and save a User with given password (Github OAuth code).
        """
        if not password:
            raise Exception("Github OAuth code must be supplied")

        return self.model.authorize(password)

    def create_superuser(self, github_id, password=None, **extra_fields):
        """
        Create and save a SuperUser with the given github_id.
        """

        if not self.password:
            raise Exception("Password must be supplied")

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        superuser = self.model(github_id=github_id)
        superuser.save()
        return superuser
