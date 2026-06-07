from django.urls import path
from .views import login_2fa, twofa_status,setup_2fa, verify_2fa, disable_2fa, get_sessions, logout_session, logout_all_sessions

urlpatterns = [
    path("sessions/", get_sessions),
    path("sessions/<int:session_id>/logout/", logout_session),
    path("sessions/logout-all/", logout_all_sessions),
    path("2fa/setup/", setup_2fa),
    path("2fa/verify/", verify_2fa),
    path("2fa/disable/", disable_2fa),
    path("login_2fa/", login_2fa),
    path("2fa/status/", twofa_status),

]



