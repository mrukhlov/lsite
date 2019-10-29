from django.contrib import admin
from inputs.models import InputsModelExtended, LoginModel, PageTableModel
from inputs.forms import InputsModelExtendedForm

# Register your models here.
admin.site.register(InputsModelExtended)
admin.site.register(LoginModel)
admin.site.register(PageTableModel)