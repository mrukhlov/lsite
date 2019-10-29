from django import forms
from django.forms import ModelForm
from inputs.models import InputsModelExtended, InputsModelExtendedResolved
from django.contrib.auth import authenticate
from tools import *


# for input editing	
class InputsExtendedForm(forms.Form):
	service = forms.CharField(max_length=15, widget=forms.Select(choices=SERVICE_CHOICES), required=False)
	action = forms.CharField(max_length=15, widget=forms.Select(choices=ACTION_CHOICES), required=False)
	input = forms.CharField(label='Input', max_length=1000, required=False)
	object = forms.CharField(label='Input', max_length=1000, required=False)

EMPTY_LIST_ERROR = "You can't have an empty list item"


class InputsModelExtendedForm(ModelForm):
	class Meta:
		model = InputsModelExtended
		fields = '__all__'
		widgets = {'language': forms.fields.Select(attrs={'class': 'language_select_box'}), 'service': forms.fields.Select(attrs={'class': 'service_select_box'}), 'action': forms.fields.Select(attrs={'class': 'action_select_box'}), 'input': forms.fields.TextInput(attrs={'placeholder': 'Enter an input', 'class': 'input', 'id': 'input-form'}), 'object': forms.fields.TextInput(attrs={'placeholder': 'Enter an object', 'class': 'object'})}
		error_messages = {'text': {'required': EMPTY_LIST_ERROR}}


class InputsModelExtendedResolvedForm(ModelForm):
	class Meta:
		model = InputsModelExtendedResolved
		fields = '__all__'
		widgets = {'input': forms.fields.TextInput(attrs={'placeholder': 'Enter an input'}), 'object': forms.fields.TextInput(attrs={'placeholder': 'Enter an object'})}
		error_messages = {'text': {'required': EMPTY_LIST_ERROR}}


class LoginForm(forms.Form):
	username = forms.CharField(label=u'Username', max_length=1000, required=True)
	password = forms.CharField(label=u'Password', max_length=1000, required=True, widget=forms.PasswordInput())
	
	def clean(self):
		cleaned_data = super(LoginForm, self).clean()
		if not self.errors:
			user = authenticate(username=cleaned_data['username'], password=cleaned_data['password'])
			self.user = user
		return cleaned_data

	def get_user(self):
		return self.user or None


class MetaCreateForm(forms.Form):
	meta_name = forms.CharField(label='Meta name', max_length=1000, required=True)
	language = forms.CharField(max_length=30, widget=forms.Select(choices=LANGUAGE_CHOICES), required=True)


class WikiListCreateForm(forms.Form):
	site_name = forms.CharField(label='Meta name', max_length=1000, required=True)
	language_wiki = forms.CharField(max_length=30, widget=forms.Select(choices=LANGUAGE_CHOICES), required=True)


class UploadFileForm(forms.Form):
	file = forms.FileField(label=u"Upload Excel file")


class UploadCrowdinVmFileForm(forms.Form):
	file_vm = forms.FileField(label=u"Upload vm file")


class UploadCrowdinVmFileUploadForm(forms.Form):
	file_vm = forms.FileField(label=u"Upload vm file")
	path_name = forms.CharField(label='Path', max_length=1000, required=False)


class UploadCrowdinCsvFileForm(forms.Form):
	file_csv = forms.FileField(label=u"Upload csv file")


class UploadCrowdinArchiveFileForm(forms.Form):
	file_archive = forms.FileField(label=u"Upload csv archive")


class CrowdinReloadFileForm(forms.Form):
	crowdin_file_name = forms.CharField(max_length=1000, required=True)


class UploadApiaiTest(forms.Form):
	apiai_input = forms.FileField(label=u"Upload list", required=True)