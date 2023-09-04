from django.contrib.auth.models import User
from django.forms import ModelForm
from django import forms


class ContactSearchForm(forms.Form):
    id = forms.IntegerField(label='ID')
    first_name = forms.CharField(label='First Name', max_length=300, required=False)
    last_name = forms.CharField(label='Last Name', max_length=300, required=False)
    phone = forms.CharField(label='Phone', max_length=100, required=False)
    email = forms.CharField(label='Email', max_length=300, required=False)


class EditProfile(ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']