import Notiflix from 'notiflix';
import axios from 'axios';
// script.js

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentSearchQuery = '';

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);

async function handleFormSubmit(event) {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value;
  if (searchQuery === '') {
    return;
  }

  clearGallery();
  showLoader();
  currentPage = 1;
  currentSearchQuery = searchQuery;

  try {
    const images = await searchImages(searchQuery, currentPage);
    if (images.length === 0) {
      showNoResultsMessage();
    } else {
      renderGallery(images);
      if (images.length < 40) {
        hideLoadMoreButton();
      } else {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    showErrorNotification();
    console.error(error);
  } finally {
    hideLoader();
  }
}

async function loadMoreImages() {
  showLoader();

  try {
    currentPage++;
    const images = await searchImages(currentSearchQuery, currentPage);
    if (images.length === 0) {
      hideLoadMoreButton();
    } else {
      renderGallery(images);
      if (images.length < 40) {
        hideLoadMoreButton();
      }
    }
  } catch (error) {
    showErrorNotification();
    console.error(error);
  } finally {
    hideLoader();
  }
}

function searchImages(query, page) {
  const apiKey = '38181033-8eb6a97a0a1b693d6b7561cbc'; // Заміни на свій унікальний ключ доступу
  const perPage = 40; // Кількість зображень на сторінці
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  return axios.get(url).then(response => response.data.hits);
}

function renderGallery(images) {
  images.forEach(image => {
    const photoCard = createPhotoCard(image);
    gallery.appendChild(photoCard);
  });
}

function createPhotoCard(image) {
  const { webformatURL, tags, likes, views, comments, downloads } = image;

  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = webformatURL;
  img.alt = tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likesInfo = createInfoItem('Likes', likes);
  const viewsInfo = createInfoItem('Views', views);
  const commentsInfo = createInfoItem('Comments', comments);
  const downloadsInfo = createInfoItem('Downloads', downloads);

  info.appendChild(likesInfo);
  info.appendChild(viewsInfo);
  info.appendChild(commentsInfo);
  info.appendChild(downloadsInfo);

  photoCard.appendChild(img);
  photoCard.appendChild(info);

  return photoCard;
}

function createInfoItem(label, value) {
  const infoItem = document.createElement('p');
  infoItem.classList.add('info-item');
  infoItem.innerHTML = `<b>${label}</b>: ${value}`;
  return infoItem;
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoader() {
  Notiflix.Loading.standard('Searching images...');
}

function hideLoader() {
  Notiflix.Loading.remove();
}

function showNoResultsMessage() {
  Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
}

function showErrorNotification() {
  Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}
