document.addEventListener("DOMContentLoaded", () => {
  // Получаем slug и источник (?src=sold&slug=xxx)
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const src = params.get("src") || "property"; // по умолчанию property

  fetch(`/script/${src}.json`)
    .then(res => res.json())
    .then(data => {
      const property = data.find(item => item.slug === slug);
      if (!property) {
        document.body.innerHTML = "<h2>Property not found</h2>";
        return;
      }
      renderProperty(property);
    })
    .catch(err => console.error("Ошибка загрузки JSON:", err));

  function renderProperty(prop) {
    // Галерея
    const mainPhoto = document.querySelector(".main-photo img");
    const thumbsContainer = document.querySelector(".thumbnails");
    const prevBtn = document.querySelector(".gallery-arrow.left");
    const nextBtn = document.querySelector(".gallery-arrow.right");

    let currentIndex = 0;
    mainPhoto.src = prop.images[currentIndex].src;
    thumbsContainer.innerHTML = "";

    prop.images.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.src = img.src;
      thumb.alt = img.alt || "photo";
      if (index === 0) thumb.classList.add("active");
      thumb.addEventListener("click", () => {
        currentIndex = index;
        updateGallery();
      });
      thumbsContainer.appendChild(thumb);
    });

    // Функция обновления галереи
    function updateGallery() {
      mainPhoto.src = prop.images[currentIndex].src;
      document.querySelectorAll(".thumbnails img").forEach((img, i) => {
        img.classList.toggle("active", i === currentIndex);
      });
    }

    // Кнопки навигации
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + prop.images.length) % prop.images.length;
      updateGallery();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % prop.images.length;
      updateGallery();
    });

    // Инфо-блок
    const infoBar = document.getElementById("info-bar");
    infoBar.innerHTML = `
      <div class="info-item"><p class="label">Plotas</p><p class="value">${prop.M2}</p></div>
      <div class="info-item"><p class="label">Aukštai</p><p class="value">${prop.TotalFloors}</p></div>
      <div class="info-item"><p class="label">Miegamieji</p><p class="value">${prop.Bedroom}</p></div>
      <div class="info-item"><p class="label">Sklypo plotas</p><p class="value">${prop.ZonaM2}</p></div>
      <div class="info-item"><p class="label">Vonios k.</p><p class="value">${prop.Bathroom}</p></div>
      <div class="info-item price"><p class="label">Kaina</p><p class="value">${prop.Price}</p></div>
      <div class="button-wrapper"><a href="tel:+37068349117"><button class="contact-button">Susisiekite</button></a></div>
    `;

    // Описание
    const descBlock = document.getElementById("description-block");
    descBlock.innerHTML = `
      <h1>${prop.Name}</h1>
      <h3>${prop.text1 || ""}</h3>
      <p>${prop.descrizione}</p>
      <p>${prop.text3 || ""}</p>
      <p>${prop.text4 || ""}</p>
      <h3>${prop.textFinal || ""}</h3>
    `;
  }
});
