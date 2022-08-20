// --- multiple functions --- //
const refs = {
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

export function clearGallery() {
  refs.gallery.innerHTML = '';
}

export function buttonIsHidden() {
  refs.button.classList.add('visually-hidden');
}

export function buttonIsNotHidden() {
  refs.button.classList.remove('visually-hidden');
}
