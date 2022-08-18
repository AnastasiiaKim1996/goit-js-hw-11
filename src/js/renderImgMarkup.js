export function renderMarkupGallery(images) {
  return images
    .map(
      ({
        id,
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="gallery-img-wrapper id="${id}">
            <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" loading="lazy"
              class="gallery-image" />
            </a>
            <div class="galery-info">
                <p class="galery-item">${likes}
                <b> Likes :</b>
                </p>
                <p class="galery-item">${views}
                <b> Views :</b>
                </p>
                <p class="galery-item">${comments}
                <b> Comments :</b>
                </p>
                <p class="galery-item">${downloads}
                <b> Downloads :</b>
                </p>
            </div>
        </div>
      `;
      }
    )
    .join('');
}
