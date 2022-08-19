// - import - //

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderMarkupGallery } from './js/renderImgMarkup';
import { onScroll, onToTopBtn } from './js/scroll';

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

const perPage = 40;

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

// --- Form submit --- //

let searchValue = '';

refs.form.addEventListener('submit', onFormSubmit);
refs.button.addEventListener('click', onBtnClickLoadMore);

async function onFormSubmit(event) {
  event.preventDefault();
  searchValue = refs.input.value.trim();
  if (searchValue === '') {
    clearGallery();
    buttonIsHidden();
    Notiflix.Notify.info('You cannot search by empty field, try again.');
    return;
  } else {
    try {
      resetPage();
      const valueResult = await fetchImages(searchValue);
      if (valueResult.hits < 1) {
        refs.form.reset();
        clearGallery();
        buttonIsHidden();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        refs.form.reset();
        refs.gallery.innerHTML = renderMarkupGallery(valueResult.hits);
        simpleLightbox = new SimpleLightbox('.gallery a').refresh();
        buttonIsNotHidden();
        Notiflix.Notify.success(
          `Hooray! We found ${valueResult.totalHits} images.`
        );
      }
    } catch (error) {
      console.log('error:', error);
    }
  }
}

// --- multiple functions --- //

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function buttonIsHidden() {
  refs.button.classList.add('visually-hidden');
}

function buttonIsNotHidden() {
  refs.button.classList.remove('visually-hidden');
}

// --- Btn Load more --- //

async function onBtnClickLoadMore() {
  page += 1;
  try {
    const totalPages = page * perPage;
    const valueResult = await fetchImages(searchValue, page, perPage);
    console.log('totalPages:', totalPages);
    if (valueResult.totalHits <= totalPages) {
      buttonIsHidden();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    refs.gallery.insertAdjacentHTML(
      'beforeend',
      renderMarkupGallery(valueResult.hits)
    );
    smothScroll();
    simpleLightbox = new SimpleLightbox('.gallery a', valueOptionsSL).refresh();
  } catch (error) {
    console.log('error:', error);
  }
}
const valueOptionsSL = {
  overlayOpacity: 0.5,
  captionsData: 'alt',
  captionDelay: 250,
};

// --- Smoth Scroll --- //

onScroll();
onToTopBtn();

function smothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery-img-wrapper')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 3.9,
    behavior: 'smooth',
  });
}
