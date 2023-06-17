import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '37338345-b43c8e94ee90a42a68ea51720';
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;
let currentQuery = '';

loadMoreBtn.classList.add('is-hidden');

formEl.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);

const lightbox = new SimpleLightbox('.gallery a');

async function handleFormSubmit(event) {
  event.preventDefault();

  const searchQuery = event.target.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  page = 1;
  currentQuery = searchQuery;
  galleryEl.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });

    if (data.hits.length === 0) {
      showNoImagesMessage();
      return;
    }

    renderImages(data.hits);
    showLoadMoreButton();
    showSuccessMessage(data.totalHits);

    lightbox.refresh();
  } catch (error) {
    console.log(error);
    showErrorMessage();
  }
}

async function loadMoreImages() {
  page += 1;

  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: currentQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });

    renderImages(data.hits);
    scrollToNextGroup();
    lightbox.refresh();

    if (data.hits.length === 0) {
      hideLoadMoreButton();
      showEndOfResultsMessage();
      return;
    }

    if (data.hits.length < 40) {
      hideLoadMoreButton();
      showEndOfResultsMessage();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
    showErrorMessage();
  }
}

function renderImages(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
        <a class="gallery-link" href="${largeImageURL}">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      </div>
    `
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function hideLoadMoreButton() {
  loadMoreBtn.classList.add('is-hidden');
}

function showLoadMoreButton() {
  loadMoreBtn.classList.remove('is-hidden');
}

function scrollToNextGroup() {
  const cardHeight = document.querySelector('.photo-card').offsetHeight;

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showSuccessMessage(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function showNoImagesMessage() {
  Notify.warning(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function showEndOfResultsMessage() {
  Notify.info('We`re sorry, but you`ve reached the end of search results.');
}

function showErrorMessage() {
  Notify.failure('An error occurred while loading images');
}
