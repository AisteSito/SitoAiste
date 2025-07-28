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


  (function(){
    emailjs.init("YOUR_USER_ID"); // заменишь своим ключом
  })();

  document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
      .then(function(response) {
        alert("Užklausa išsiųsta!");
        document.getElementById("contactForm").reset();
      }, function(error) {
        alert("Klaida siunčiant: " + JSON.stringify(error));
      });
  });