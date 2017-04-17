$.ajax({    // Получить список городов
  url: "/api/city_list/",
  success: function(data){
    city(data);
  }
});
function city(data){    // Создаем Select
    var data = JSON.parse(data);
    for(i = 0;i < data.length; i++) {
        $('#id_city').append('<option value='+data[i]._id+'>'+data[i].name+', '+data[i].country+'</option>');
    };
    req_data()
};

function req_data (){   // Получить информацию о погоде
    $.ajax({
      url: "api/weather/",
      data: {'po': $("#id_city").val()},
      success: function(data){
        main(data);
      }
    });
};

$(document).ready(function(){   // Валидация выбора города в Select

    $('#city').click(function() {
        if ($("#id_city").val() != '') {
            $('#select_city').attr('action','/'+$("#id_city").val()+'/');
        } else {
            event.preventDefault();
        }

    });
});


function main(data) {

    var data = JSON.parse(data);    // Данные погоды
    var pars = Date.parse(data.date_request);   // Дата запроса
    var pars_date = Date(data.date_request);
    var now_date  = new Date(pars_date);
    var list_date = [];

    var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    };
    for (i = 0; i < data.cnt; i++) {    // Формат вывода даты
        var now_date  = new Date(pars_date);
        now_date.setDate(now_date.getDate() + i);
        list_date.push(now_date.toLocaleString("en-US", options));
        };


    $(document).ready(function() {  // Вносим данные в таблицу
        for(i = 0;i < data.list.length; i++) {
            $('#table_weather').append(`<tr>
                                        <td>`+list_date[i]+`</td>
                                        <td>`+data.list[i].temp.max+'/'+data.list[i].temp.min+`</td>
                                        <td>`+data.list[i].speed+`</td>
                                        <td>`+data.list[i].clouds+`</td>
                                        <td>`+data.list[i].pressure+`</td>
                                        <td>`+data.list[i].weather[0].description+`</td>
                                        </tr>`);
        };
        $('p#p_city').append(data.city.name+', '+data.city.country);
        $('p#p_coord').append('latitude: '+data.city.coord.lat+', longitude: '+data.city.coord.lon);
    });


    // Списки данных для графиков
    var temp_day = [];
    var temp_night = [];
    var pressure = []
    for (i = 0; i < data.cnt; i ++) {
        temp_day.push(data.list[i].temp.day);
        temp_night.push(data.list[i].temp.night);
        pressure.push(data.list[i].pressure)
    };


    Highcharts.chart('temperature', {   // График температуры

    title: {
        text: data.city.name
    },

    subtitle: {
        text: 'Source: openweathermap.org'
    },
    xAxis: {
        categories: list_date
    },

    yAxis: {
        title: {
            text: 'Deg'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    series: [{
        name: 'Daytime temperature',
        data: temp_day
    },
    {
        name: 'Night temperature',
        data: temp_night
    }
    ]

});

    Highcharts.chart('pressure', {  // График давления

    title: {
        text: data.city.name
    },

    subtitle: {
        text: 'Source: openweathermap.org'
    },
    xAxis: {
        categories: list_date
    },

    yAxis: {
        title: {
            text: 'hPa'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    series: [{
        name: 'Pressure',
        data: pressure
    },
    ]

});
};






