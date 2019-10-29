from social.apps.django_app.middleware import SocialAuthExceptionMiddleware
from django.shortcuts import HttpResponse, redirect
from social import exceptions as social_exceptions

class SocialAuthExceptionMiddleware(SocialAuthExceptionMiddleware):
	def process_exception(self, request, exception):
		if hasattr(social_exceptions, 'AuthForbidden'):
			#return HttpResponse("I'm the Pony %s" % exception)
			return redirect('login')
		else:
			raise exception