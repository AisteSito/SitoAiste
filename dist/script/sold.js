document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("properties-container");

  // Загружаем JSON
  fetch("/script/sold.json") // путь к твоему JSON файлу
    .then((res) => res.json())
    .then((data) => {
      renderProperties(data);
    })
    .catch((err) => {
      console.error("Ошибка загрузки JSON:", err);
    });

  // Функция отрисовки
function renderProperties(properties) {
  container.innerHTML = ""; // очищаем контейнер

  properties.forEach((prop) => {
    const card = document.createElement("div");
    card.classList.add("property-card");
    card.style.backgroundImage = `url('${prop.images[0].src}')`;

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
            <a class="btn-main" href="/property/?src=sold&slug=${prop.slug}">Plačiau</a>
            <a class="btn-icon" href="/property/?src=sold&slug=${prop.slug}">&#8594;</a>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
 }
});
