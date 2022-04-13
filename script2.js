const api ={
    key: "a28f638125dc74984f972287d81b92a3",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
}

const fullData = document.querySelector('#full-data')
const data = new Date();
const day = data.getDay();  //Dia da semana
const date = data.getDate() //Dia numeral
const month = data.getMonth(); //Mês
const year = data.getFullYear(); //Ano

const weakDay =["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];
const mounths = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Novembro", "Dezembro"];
fullData.textContent=`${weakDay[day]}, ${date} de ${mounths[month]} de ${year}`;


const html = document.querySelector('html')
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const city = document.querySelector('#city');
const temperature = document.querySelector('.container-temp');
const weather = document.querySelector('.container-weather');
const lowMax = document.querySelector('.container-low-max');
const img = document.querySelector('.container-img');
const checkbox = document.querySelector('.checkbox');

//Dark Theme
checkbox.addEventListener('change', () =>{
    html.classList.toggle('dark-mode')
})

//Método normal
searchButton.addEventListener('click', function(){
    searchResults(searchInput.value);
})

searchInput.addEventListener('keypress', enter)
function enter(event){
    key = event.keyCode
    if(key === 13){
        searchResults(searchInput.value);
    }
}

function searchResults(city){
    fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response =>{
            console.log(response)
            if(!response.ok){
                throw new Error(`http error: Status ${response.status}`)
            }
            return response.json();
        })
        .catch(error =>{
            alert(error.message)
        })
        .then(response =>{
            displayResults(response)
        })
}

//Método de Geolocalização
window.addEventListener('load', () =>{
    if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(setPosition, showError); 
    }else {
        alert('Navegador não suporta geolocalizaçãon !')
    }

    function setPosition(position){
        console.log(position)
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }
    function showError(error){
        alert(`Erro: ${error.message}`);
    }
})

function coordResults(lat, long) {
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}

function displayResults(weather){
    console.log(weather)

    city.textContent=`${weather.name}, ${weather.sys.country}`
    temperature.textContent=`${Math.floor(weather.main.temp)} °C`
    weather.textContent=`${weather.description}`
    lowMax.textContent=`${Math.floor(weather.main.temp_min)}°C/${Math.floor(weather.main.temp_max)}°C`

    let iconName = weather.weather[0].icon;
    img.innerHTML = `<img src="./icons/${iconName}.png">`;
}