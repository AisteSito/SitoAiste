const mainPhoto = document.querySelector('.main-photo img');
const thumbs = document.querySelectorAll('.thumbnails img');

thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    mainPhoto.src = thumb.src.replace('thumb', 'large');
    document.querySelector('.thumbnails img.active')?.classList.remove('active');
    thumb.classList.add('active');
  });
});

// Установить начальный активный
if (thumbs[0]) thumbs[0].classList.add('active');
