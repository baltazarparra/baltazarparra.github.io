 var $tr = document.querySelector('[data-js="table-row"]');
 var $table = document.querySelector('[data-js="table"]');
 var $submit = document.querySelector('[data-js="submit"]');
 var $input = document.querySelector('[data-js="input"]');
 var $cardLocal = document.querySelector('[data-js="card-local"]');
 var $cardTemp = document.querySelector('[data-js="card-temp"]');
 var $cardState = document.querySelector('[data-js="card-state"]');
 var $cardMintemp = document.querySelector('[data-js="card-mintemp"]');
 var $cardMaxtemp = document.querySelector('[data-js="card-maxtemp"]');
 var $cardSensation = document.querySelector('[data-js="card-sensation"]');
 var $cardWind = document.querySelector('[data-js="card-wind"]');
 var $cardHumi = document.querySelector('[data-js="card-humi"]');

 function getCard() {

     var request = new XMLHttpRequest();
     var cidade = $input.value;

     request.open('GET', 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where u="c" and woeid in (select woeid from geo.places(1) where text="' + cidade + '")&format=json', true);

     request.onload = function() {
         if (request.status >=200 && request.status < 400) {
             var data = JSON.parse(request.responseText);

             var $local = document.createElement('td');
             var $temp = document.createElement('td');
             var $state = document.createElement('td');
             var $min = document.createElement('td');
             var $max = document.createElement('td');
             var $sensation = document.createElement('td');
             var $wind = document.createElement('td');
             var $humi = document.createElement('td');

             $local.textContent = data.query.results.channel.location.city + ', ' + data.query.results.channel.location.region + ' - ' + data.query.results.channel.location.country;
             $temp.textContent = data.query.results.channel.item.condition.temp + 'ºC';
             $state.textContent = data.query.results.channel.item.condition.text;
             $min.textContent = data.query.results.channel.item.forecast[0].low + 'º';
             $max.textContent = data.query.results.channel.item.forecast[0].high + 'º';
             var convertF = (data.query.results.channel.wind.chill - 32) * 5/9;
             $sensation.textContent = Math.floor(convertF) + 'º';
             $wind.textContent = 'Vento: ' + Math.floor(data.query.results.channel.wind.speed) + 'Km/h';
             $humi.textContent = 'Humidade: ' + data.query.results.channel.atmosphere.humidity + '%';

             $cardLocal.appendChild($local);
             $cardTemp.appendChild($temp);
             $cardState.appendChild($state);
             $cardMintemp.appendChild($min);
             $cardMaxtemp.appendChild($max);
             $cardSensation.appendChild($sensation);
             $cardWind.appendChild($wind);
             $cardHumi.appendChild($humi);

         } else {

         }
     };

     request.onerror = function() {
     };

     request.send();
 }

$submit.addEventListener('submit', function(e) {
    e.preventDefault();
    getCard();
    $table.style.display = 'block';
});

function getWeather() {

    var request = new XMLHttpRequest();
    var cidade = 'Rio de Janeiro';

    request.open('GET', 'https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where u="c" and woeid in (select woeid from geo.places(1) where text="' + cidade + '")&format=json', true);

    request.onload = function() {
        if (request.status >=200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            var $tdHigh = document.createElement('td');
            var $tdLow = document.createElement('td');
            var $tdCity = document.createElement('td');

            $tdHigh.textContent = data.query.results.channel.item.forecast[0].high + 'º';
            $tdLow.textContent = data.query.results.channel.item.forecast[0].low + 'º';
            $tdCity.textContent = data.query.results.channel.location.city;

            $tr.appendChild($tdHigh);
            $tr.appendChild($tdLow);
            $tr.appendChild($tdCity);

        } else {

        }
    };

    request.onerror = function() {
    };

    request.send();
}

getWeather();
