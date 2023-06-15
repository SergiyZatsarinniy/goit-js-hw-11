import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

const API_kEY = '37338345-b43c8e94ee90a42a68ea51720';
const BASE_URL = 'https://pixabay.com/api/';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('click', handleFormSubmit);
refs.loadBtn.addEventListener('click', handleLoadMore);

//     fetch('https://api.thecatapi.com/v1')
//   .then(response => console.log(response))
//   .catch(error => console.error(error));

// axios
//   .get('https://api.thecatapi.com/v1')
//   .then(response => console.log(response))
//   .catch(error => console.error(error));
