from django.db import models


class JsonWeather(models.Model):
    weather = models.TextField()
    date_request = models.CharField(max_length=10)

    def __str__(self):
        return str(self.date_request)


class CityList(models.Model):
    city = models.TextField()


