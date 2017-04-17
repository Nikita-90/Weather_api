from django.conf.urls import url

from . import views

app_name = 'weather'
urlpatterns = [
    url(r'^$', views.start_page, name='start_page'),
    url(r'^(?P<city_id>[0-9]+)/$', views.index, name='index'),
    url(r'^(?P<city_id>[0-9]+)/api/weather/$', views.give_weather_json, name='get_weather'),
    url(r'^api/city_list/$', views.give_city_json, name='get_city_list'),
]