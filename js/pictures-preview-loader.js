import { openPicturePopup } from './show-image-fullscreen.js';


const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const picturesFragment = document.createDocumentFragment();


/**
* Отображает превью изображений на странице.
* @param {Array} usersPictures - Массив объектов с данными изображений.
*/

const renderPictures = (usersPictures) => {
  usersPictures.forEach(({ url, description, likes, comments }) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = url;
    pictureElement.querySelector('.picture__img').alt = description;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;

    pictureElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      openPicturePopup(url, description, likes, comments);
    });

    picturesFragment.appendChild(pictureElement);

  });

  picturesContainer.appendChild(picturesFragment);

};

export { picturesContainer, renderPictures };
