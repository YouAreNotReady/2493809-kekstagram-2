import { isEscapeKey } from './util.js';
import { uploadData } from './api.js';
import { showError } from './show-status-popup.js';
import { imagePreview, scaleValueField } from './image-scaling.js';
import { sliderNodeWrapper, effectPreviewElements } from './image-effect.js';
import { validateAllHashtags, validateHashtagError } from './hashtag-validation.js';
import { validateComment, validationCommentError } from './comment-validation.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const imageUploadForm = document.querySelector('.img-upload__form');
const imageUploadOverlay = imageUploadForm.querySelector('.img-upload__overlay');
const imageUploadInput = imageUploadForm.querySelector('.img-upload__input');
const imageUploadSubmit = imageUploadForm.querySelector('.img-upload__submit');
const imageUploadCloseButton = imageUploadForm.querySelector('.img-upload__cancel');
const effectOriginalNode = imageUploadForm.querySelector('#effect-none');
const hashtagsInput = imageUploadForm.querySelector('.text__hashtags');
const commentInput = imageUploadForm.querySelector('.text__description');

const pristine = new Pristine(imageUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
}, false);

const blockSubmitButton = () => {
  imageUploadSubmit.disabled = true;
};

const unblockSubmitButton = () => {
  imageUploadSubmit.disabled = false;
};

const documentKeydownHandler = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    uploadFormCloseHandler();
    imageUploadForm.removeEventListener('keydown', uploadFormInputsEscKeydownHandler);
    imageUploadCloseButton.removeEventListener('click', uploadFormCloseHandler);
  }
};

function uploadFormClear() {
  hashtagsInput.value = '';
  commentInput.value = '';
  effectOriginalNode.checked = true;
  sliderNodeWrapper.classList.add('hidden');
  imagePreview.style.filter = '';
  scaleValueField.value = '100%';
  imagePreview.style.transform = '';
}

function uploadFormCloseHandler() {
  imageUploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  imageUploadInput.value = '';
  uploadFormClear();
  pristine.reset();

  document.removeEventListener('keydown', documentKeydownHandler);
  imageUploadCloseButton.removeEventListener('click', uploadFormCloseHandler);
}

function uploadFormInputsEscKeydownHandler(evt) {
  if(isEscapeKey(evt) && (evt.target === hashtagsInput || evt.target === commentInput)) {
    evt.stopPropagation();
  }
}

imageUploadInput.addEventListener('change', ()=> {
  const file = imageUploadInput.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((extension) => fileName.endsWith(extension));
  if (matches) {
    const tempPath = URL.createObjectURL(file);
    imagePreview.src = tempPath;
    effectPreviewElements.forEach((preview) => {
      preview.style.backgroundImage = `url("${tempPath}")`;
    });
  }

  imageUploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  imageUploadForm.addEventListener('keydown', uploadFormInputsEscKeydownHandler);
  imageUploadCloseButton.addEventListener('click', uploadFormCloseHandler);
  document.addEventListener('keydown', documentKeydownHandler);
});

const imageUploadSubmitHandler = async (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if(isValid) {
    try {
      const formData = new FormData(evt.target);
      blockSubmitButton();
      uploadData(formData);
      pristine.reset();
    } catch (error) {
      showError();
    }
  }

  imageUploadForm.removeEventListener('keydown', uploadFormInputsEscKeydownHandler);
  imageUploadCloseButton.removeEventListener('click', uploadFormCloseHandler);
};

const initForm = () => {
  imageUploadForm.addEventListener('submit', imageUploadSubmitHandler);
};

pristine.addValidator(imageUploadForm.querySelector('.text__hashtags'), validateAllHashtags, validateHashtagError);
pristine.addValidator(imageUploadForm.querySelector('.text__description'), validateComment, validationCommentError);

export { initForm, uploadFormCloseHandler, documentKeydownHandler, unblockSubmitButton};
