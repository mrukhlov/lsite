from django.conf.urls import patterns, include, url
from django.contrib import admin
import inputs

urlpatterns = patterns('',
    # Examples:
	url(r'^', include('inputs.urls')),
	url(r'^admin/', include(admin.site.urls)),
    url('', include('social.apps.django_app.urls', namespace='social')),
    url('', include('django.contrib.auth.urls', namespace='auth')),
    #url(r'^lab/', include('inputs.urls')),
	#url(r'^$', 'inputs.views.input_form', name='home'),
	url(r'^social_auth_login/([a-z]+)$', inputs.views.social_auth_login, name='users-social-auth-login'),
)
