import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchCountryRef: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchCountryRef.addEventListener(
  'input',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);

function onSearchCountry(e) {
  const name = e.target.value.trim();
  if (name === '') return clear();
  fetchCountries(name)
    .then(renderMarkup)
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clear();
    });
}

function createMarkup(countries) {
  const markup = countries.map(
    country =>
      `<li><img src="${country.flags.svg}" alt="Flag of ${country.name.common}"><h1>${country.name.common}</h1></li>`
  );

  return markup.join('');
}

function createSingleCountryMarkup(country) {
  const markup = country.map(
    country =>
      `<p><b>Capital</b>: ${country.capital}</p><p><b>Population</b>: ${
        country.population
      }</p><p><b>Languages</b>: ${Object.values(country.languages).join(
        ', '
      )}</p>`
  );
  return markup.join('');
}

function clear() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function renderMarkup(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    clear();
    return;
  }

  clear();
  refs.countryList.insertAdjacentHTML('beforeend', createMarkup(countries));

  if (countries.length === 1) {
    refs.countryInfo.insertAdjacentHTML(
      'beforeend',
      createSingleCountryMarkup(countries)
    );
  }
}
