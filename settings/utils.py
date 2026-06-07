def get_client_ip(request):
    x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded:
        return x_forwarded.split(",")[0]
    return request.META.get("REMOTE_ADDR")


def get_device(request):
    user_agent = request.META.get("HTTP_USER_AGENT", "Unknown")
    return user_agent[:100]  # basic version