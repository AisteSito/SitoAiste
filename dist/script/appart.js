document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("properties-container");

  fetch("https://raw.githubusercontent.com/AisteSito/AisteCMS/main/appart/appart.json")
    .then((res) => res.json())
    .then((data) => {
      renderProperties(data);
    })
    .catch((err) => {
      console.error("Ошибка загрузки JSON (appart):", err);
    });

  function renderProperties(properties) {
    container.innerHTML = ""; // очищаем контейнер

    properties.forEach((prop) => {
      const card = document.createElement("div");
      card.classList.add("property-card");

      // Убираем "/foto/appart/" из пути — фото лежат в корне папки appart
      const firstImage = prop.images[0].src.replace("/foto/appart/", "");

      // Создаём блок с текстом
      const contentBlock = document.createElement("div");
      contentBlock.classList.add("property-content");
      contentBlock.innerHTML = `
        <div class="property-text">
          <h3>${prop.Name}</h3>
          <p class="property-description">${prop.descrizione}</p>
        </div>
        <div class="prop-down-sec">
          <div>
            <p class="property-size">${prop.M2}</p>
            <p class="property-price">${prop.Price}</p>
          </div>
          <div class="property-buttons">
            <a class="btn-main" href="https://api.whatsapp.com/send?phone=37068349117">Plačiau &#8594;</a>
          </div>
        </div>
      `;

      // Создаём блок с изображением
      const imageBlock = document.createElement("div");
      imageBlock.classList.add("property-image");
      imageBlock.innerHTML = `
        <img src="https://raw.githubusercontent.com/AisteSito/AisteCMS/main/appart/${encodeURIComponent(firstImage)}" alt="${prop.Name}" />
        <button class="info-toggle-btn">Info ℹ️</button>
      `;


      // Добавляем блоки в карточку
      card.appendChild(contentBlock);
      card.appendChild(imageBlock);

      // Добавляем обработчик клика на кнопку
      const toggleBtn = imageBlock.querySelector(".info-toggle-btn");
      toggleBtn.addEventListener("click", () => {
        if (contentBlock.style.display === "flex") {
          contentBlock.style.display = "none";
        } else {
          contentBlock.style.display = "flex";
        }
      });

      container.appendChild(card);
    });
  }
});