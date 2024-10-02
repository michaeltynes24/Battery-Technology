
from django import forms
from .models import JsonModel
import json

class JSONUploadForm(forms.ModelForm):
    class Meta:
        model = JsonModel
        fields = ['file']

    def file_clean(self):
        uploaded_file = self.cleaned_data.get('file')
        try:
            json.loads(uploaded_file.read().decode('utf-8'))
        except (ValueError, json.JSONDecodeError):
            raise forms.ValidationError("This file is not a valid JSON")
        return uploaded_file

