import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require('lodash.debounce');
const DELAY = 300;
const MAX_LIMIT = 10;
const MIN_LIMIT = 1;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  card: document.querySelector('.country-info'),
};
refs.input.addEventListener('input', debounce(getData, DELAY));

function getData(event) {
  let countryName = event.target.value.trim();

  if (countryName === '') {
    resetHtml(refs.list, refs.card);
  } else {
    resetHtml(refs.list, refs.card);
    fetchCountries(countryName).then(countries =>
      initializeCountries(countries)
    );
  }
}

function initializeCountries(countries) {
  if (countries.length > MAX_LIMIT) {
    resetHtml(refs.list);
    resetHtml(refs.card);
    Notify.info('Too many matches found. Please enter a more specific name.');
  }

  for (let i = 0; i < countries.length; i += 1) {
    const stats = {
      countryName: countries[i].name,
      Capital: countries[i].capital,
      Popupaltion: countries[i].population,
      Flags: countries[i].flags.svg,
      Languages: countries[i].languages,
    };
    stats.Languages = stats.Languages[0].nativeName;

    if (countries.length > MIN_LIMIT && countries.length < MAX_LIMIT) {
      getCoutriesListResult(stats);
      resetHtml(refs.card);
    } else if (countries.length === MIN_LIMIT) {
      getCountryCardResult(stats);
      resetHtml(refs.list);
    }
  }
}

function resetHtml(clearHtml) {
  clearHtml.innerHTML = '';
}

function getCoutriesListResult({ countryName, Flags }) {
  refs.list.insertAdjacentHTML(
    'beforeend',
    `<li style='display: inline-flex; gap: 10px'><img src=" ${Flags}" alt="Country Flag" width="36px" height='24px'><span> ${countryName}</span></li>`
  );
  refs.list.style.listStyleType = 'none';
}

function getCountryCardResult({
  countryName,
  Capital,
  Popupaltion,
  Flags,
  Languages,
}) {
  refs.card.insertAdjacentHTML(
    'beforeend',
    `<ul style="list-style-type: none" >
  <li style='display: flex; align-items: center; gap: 10px'><img src="${Flags}" alt="Country Flag" height='24px' width="36px"></img><span style="font-size: 30px  "><b> ${countryName}</b></span></li>
    <listyle='display: inline-flex'><span><b>Capital:</b> ${Capital}</span></li>
    <li><span><b>Population</b>: ${Popupaltion}</span></li>
    <li><span><b>Languages</b>: ${Languages}</span></li>
  </ul>`
  );
}
