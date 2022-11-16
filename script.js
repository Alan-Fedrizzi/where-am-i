'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const renderCountry = function (data, city, state, className = '') {
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__city">${city}</h4>
        <h4 class="country__state">${state}</h4>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>Population: ${(
          +data.population / 1000000
        ).toFixed(1)} million</p>
        <p class="country__row"><span>🗣️</span>Language: ${
          data.languages[0].name
        }</p>
        <p class="country__row"><span>💰</span>Currency: ${
          data.currencies[0].name
        }</p>
      </div>
    </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const whereAmI = async function () {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language='eng'`
    );

    // Handling any errors
    if (!resGeo.ok) throw new Error('Problem getting location data');

    const dataGeo = await resGeo.json();

    console.log(dataGeo);

    // Contry data
    const res = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.address.country}`
    );

    const city = dataGeo.address.city;
    const state = dataGeo.address.state;

    // Handling any errors
    if (!res.ok) throw new Error('Problem getting country');

    const data = await res.json();
    console.log(data[0]);

    renderCountry(data[0], city, state);

    btn.classList.add('btn-country--disabled');

    return `You are in ${dataGeo.address.city}, ${dataGeo.address.country}`;
  } catch (err) {
    renderError(`${err.message}`);

    // Reject promise returned from async function
    throw err;
  }
};

btn.addEventListener('click', whereAmI);
