from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None


class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        scope["user"] = AnonymousUser()

        query_string = parse_qs(
            scope["query_string"].decode()
        )

        token = query_string.get("token")

        if token:
            try:
                access_token = AccessToken(token[0])
                user = await get_user(
                    access_token["user_id"]
                )
                scope["user"] = user
            except Exception as e:
               print("JWT ERROR:", e)

        return await self.inner(scope, receive, send)