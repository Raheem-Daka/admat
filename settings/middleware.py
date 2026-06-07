class UpdateSessionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.user.is_authenticated and request.session.session_key:
            UserSession.objects.filter(
                session_key=request.session.session_key
            ).update(last_active=timezone.now())

        return response