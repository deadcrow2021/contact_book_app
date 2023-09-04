from phonenumber_field.modelfields import PhoneNumberField
from django.db import models


class Contact(models.Model):
    first_name = models.CharField(max_length=300, blank=True, null=True)
    last_name = models.CharField(max_length=300, blank=True, null=True)
    phone = PhoneNumberField(blank=True, null=True, unique=True)
    email = models.EmailField(max_length=300, blank=True, null=True, unique=True)

    def __str__(self):
        return self.first_name + self.last_name
