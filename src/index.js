// - import - //

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderMarkupGallery } from './js/renderImgMarkup';

// --- variables --- //

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.input'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

// --- Fetch Img  --- //

const DEFAULT_PAGE = 1;
let page = DEFAULT_PAGE;

const perPage = 30;

async function fetchImages(searchValue) {
  const searchParams = new URLSearchParams({
    key: '29338036-8ca2af07466f8459e5d49b2a7',
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: perPage,
    page,
  });
  const images = await axios
    .get(`https://pixabay.com/api/?${searchParams}`)
    .then((page += 1));
  return images.data;
}

function resetPage() {
  page = DEFAULT_PAGE;
}

// --- --- //\

let simpleLightbox;

refs.form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  searchValue = refs.input.value.trim();
  if (searchValue === '') {
    clearAll();
    buttonHidden();
    Notiflix.Notify.info('You cannot search by empty field, try again.');
    return;
  } else {
    try {
      resetPage();
      const result = await fetchImages(searchValue);
      if (result.hits < 1) {
        refs.form.reset();
        clearAll();
        buttonHidden();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        refs.form.reset();
        refs.gallery.innerHTML = renderMarkupGallery(result.hits);
        simpleLightbox = new SimpleLightbox('.gallery a').refresh();
        buttonUnHidden();
        Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      }
    } catch (error) {
      console.log('error:', error);
    }
  }
}

function clearAll() {
  refs.gallery.innerHTML = '';
}

function buttonHidden() {
  refs.button.classList.add('visually-hidden');
}

function buttonUnHidden() {
  refs.button.classList.remove('visually-hidden');
}
