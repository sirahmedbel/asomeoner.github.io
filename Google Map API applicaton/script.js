let map, bounds;
const API_KEY = '0f85ebc972mshbb7eb18ea2a3aa6p1971d3jsn4a272b66c335'
//inilizen google map
async function initMap() {
  const center = {lat: 29.941347, lng: -90.03759}
  const zoom = 8
  const { Map } = await google.maps.importLibrary("maps");//import class of "maps"
  map = new Map(document.getElementById("mapContainer")/*apply the class in the element that get by id*/, {/*optins:*/ center,zoom,disableDefaultUI: true });
  bounds = new google.maps.LatLngBounds()//creat new view
}
window.initMap = initMap; 
//hotels API


const fetchHotels = async (country) =>{
  const url = `https://hotels4.p.rapidapi.com/locations/v3/search?q=${country}`;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': API_KEY,
		'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
	}
}
  const response = await fetch(url, options);
	const result = await response.json();
  getMarkers(result.sr)//run the function with the country of targget
}
//fetchHotels('Algeria')

//counrties API

const fetchCountries = async () => {
  const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/countries?limit=10';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': API_KEY,
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
}
  const response = await fetch(url, options);//import API
	const result = await response.json();//convert to json form
	//console.log(result.data); //print data in the console
  return result.data;
}
//fetchCountries() run the function

(async function loadCountries(){
  const counrties = await fetchCountries() //run fetchCountries and put its return in constant var
  const counrtiesList = document.querySelector('#countries_list') // take the countries targget
  const counrtiesInput = document.querySelector('#countries_input') // take the countries input targget
  for (let i = 0; i < counrties.length; i++) {
  // for each index in countries list do -->
    counrtiesList.innerHTML += `
    <li data-country=${counrties[i].name}>${counrties[i].name}</li>
    `//add a html targget "li" contien a data in countries 
    counrtiesList.style.display = "none" //hide countries list
    counrtiesInput.addEventListener('click', function () {
     counrtiesList.style.display = "block" //show countries list whem click input
    })
  }


  const allCountries = Array.from(counrtiesList.children)//convert the html cllection to an array
  allCountries.map(
    country=>{
      //arrou function from country parameter
        country.addEventListener('click',function(e){
        //when a li country targget clicked do -->
          //console.log(e.target.dataset.country)//print the country of the targget
          const selectedCountry = e.target.dataset.country          
          counrtiesInput.value = selectedCountry//set input value to the country of the targget
          counrtiesList.style.display = "none" //hide countries list
          fetchHotels(selectedCountry)//fetch the API of Hotels in the country of the targget
      })
    }
    )//map this array
})()//run in the opening site moment

function getMarkers(Markers){
  Markers.map((hotel, index)=>{
    /*map the result "lat & lng" of each country */
      const lat = parseFloat(hotel.coordinates.lat)// the lat of country
      const lng = parseFloat(hotel.coordinates.long)//the lng of country
      const position = {lat, lng} //position of the country
      const label = (index + 1).toString()//the labl of each country
      new google.maps.Marker({/*options of the mark*/position,label,map})//make a mark in hte map
      bounds.extend(new google.maps.LatLng(position))//extanded view for contien hte markers
      map.fitBounds(bounds)//extand the view
    })
}

const search = document.querySelector('#search')//the input
const suggest_list = document.querySelector('#auto_suggest_list')//the list
search.addEventListener('input', async (e) => {
  if(e.target.value === '')/*if input empty*/{
    suggest_list.innerHTML = ''//remove list "li"s
    }else{
    const contries = await fetchCountries()
    const selectedCountries =
    //select the countries in the list
     contries.filter((country) => {return country.name.toLowerCase().startsWith(e.target.value)})//chose the contries list by input value what it start
     suggest_list.innerHTML = ''//remove list "li"s
     selectedCountries.map(country => {
      //map the country list
      suggest_list.innerHTML += `<li data-country="${country.name}">${country.name}</li>`//add each contry in the list to li in ul list
     })
  
     const filteredCountries = Array.from(suggest_list.children)//convrt hte list to array
     filteredCountries.map((country)=>{
      //map the array
       country.addEventListener('click',function (e) {
         fetchHotels(e.target.dataset.country)//run the function with value
         suggest_list.innerHTML = ''//remove list "li"s
         search.value = e.target.dataset.country//set input value to clicked country
       })//when clicked do _-^
     })
  }

  

})//when input do _-^
