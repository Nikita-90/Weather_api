import requests
import datetime
import json

from django.http.response import HttpResponse
from django.shortcuts import render, redirect

from .models import JsonWeather, CityList


URL = 'http://api.openweathermap.org/data/2.5/forecast/daily?id=703448&cnt=14&units=metric' \
      '&APPID=14ff65b01e70f4669d1efc10fac26a45'


def start_page(requset):
    return redirect('/703448/')


def index(request, city_id):
    if request.method == 'POST':
        if 'list_city' in request.POST:
            update_city_list()
    return render(request, 'weather/index.html')


def change_url(city_id):
    print('change_url', city_id)
    return 'http://api.openweathermap.org/data/2.5/forecast/' \
           'daily?id={}&cnt=14&units=metric&APPID=14ff65b01e70f4669d1efc10fac26a45'.format(city_id)


def parser(url):
    url = url
    response = requests.get(url)
    return response.json()


def save_weather_to_db(url):
    parsing = parser(url)
    jw = JsonWeather(weather=json.dumps(parsing), date_request=str(datetime.date.today()))
    jw.save()


def give_weather_json(request, city_id):
    url = change_url(city_id)
    save_weather_to_db(url)
    jw = JsonWeather.objects.all()
    jw = list(jw)[-1]
    jw = json.loads(jw.weather)
    return HttpResponse(json.dumps(jw))


def give_city_json(request):
    city_list = CityList.objects.all()[0].city
    city_list = json.loads(city_list)
    city_list.sort(key=lambda x: x['name'])
    return HttpResponse(json.dumps(city_list))


def update_city_list():
    CityList.objects.all().delete()
    with open(r'weather/media/city.list.json', 'rt') as f:
        i = 0
        list_ad = []
        for js in f.readlines():
            list_ad.append(json.loads(js.rstrip()))
            i += 1
            print(i)
        city_list = CityList(city=json.dumps(list_ad))
        city_list.save()
