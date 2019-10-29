from django.db import models
from django import forms
from django.forms import ModelForm
from django.core.exceptions import ValidationError
from tools import *

DUPLICATE_ITEM_ERROR = "You've already got this in your list"
	
class LoginModel(models.Model):
	username = models.TextField()
	password = models.TextField()
	def __str__(self):
		return self.username
		
class InputsModelExtended(models.Model):
	service = models.CharField(max_length=1000, choices=SERVICE_CHOICES, blank=True)
	action = models.CharField(max_length=1000, choices=ACTION_CHOICES, blank=True)
	input = models.TextField(max_length=1000)
	object = models.TextField(max_length=1000, blank=True)
	language = models.TextField(max_length=1000, choices=LANGUAGE_CHOICES, blank=True)
	def __str__(self):
		return self.input
	class Meta:
		ordering = ["service"]
		unique_together = ('service', 'action', 'input', 'object')


class InputsModelExtendedResolved(models.Model):
	service = models.CharField(max_length=1000, choices=SERVICE_CHOICES, blank=True)
	action = models.CharField(max_length=1000, choices=ACTION_CHOICES, blank=True)
	input = models.TextField(max_length=1000)
	object = models.TextField(max_length=1000, blank=True)
	language = models.TextField(max_length=1000, choices=LANGUAGE_CHOICES, blank=True)
	def __str__(self):
		return self.input
	class Meta:
		ordering = ["service"]
		unique_together = ('service', 'action', 'input', 'object')

class PageTableModel(models.Model):
	table = models.TextField()
	def __str__(self):
		return self.table