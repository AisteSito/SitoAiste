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
      card.style.backgroundImage = `url('https://raw.githubusercontent.com/AisteSito/AisteCMS/main/appart/${encodeURIComponent(firstImage)}')`;

      card.innerHTML = `
        <div class="property-content">
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
              <a class="btn-main" href="/property/?slug=${prop.slug}&src=appart">Plačiau</a>
              <a class="btn-icon" href="/property/?slug=${prop.slug}&src=appart">&#8594;</a>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }
});