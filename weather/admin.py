from django.contrib import admin

from .models import JsonWeather, CityList


admin.site.register(JsonWeather)
admin.site.register(CityList)
