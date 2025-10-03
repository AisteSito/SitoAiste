// property.js (исправленная версия)
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const src = params.get("src") || "villa"; // по умолчанию villa

  const allowedFolders = ["villa", "sold", "rent", "appart"];
  if (!allowedFolders.includes(src)) {
    document.body.innerHTML = "<h2>Invalid source folder</h2>";
    return;
  }

  const RAW_BASE = "https://raw.githubusercontent.com/AisteSito/AisteCMS/main";

  // helper: кодируем сегменты пути, при этом сохраняем слэши
  function encodePathPreserveSlashes(p) {
    // убираем ведущие слэши и разделяем по "/"
    const clean = (p || "").replace(/^\/+/, "");
    return clean.split("/").map(encodeURIComponent).join("/");
  }

  const jsonUrl = `${RAW_BASE}/${src}/property.json`;
  fetch(jsonUrl)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch JSON: ${res.status} ${res.statusText} — URL: ${jsonUrl}`);
      }
      return res.text(); // сначала текст — чтобы в логах было видно, что вернулось
    })
    .then(text => {
      // попытка распарсить JSON, если в ответе была HTML-страница — сообщаем об этом
      try {
        const data = JSON.parse(text);
        const property = data.find(item => item.slug === slug);
        if (!property) {
          console.error("Slug not found. Check JSON content at:", jsonUrl);
          document.body.innerHTML = "<h2>Property not found</h2>";
          return;
        }
        renderProperty(property, src);
      } catch (err) {
        console.error("Ошибка парсинга JSON:", err);
        console.log("Raw response preview:", text.slice(0, 500));
        document.body.innerHTML = "<h2>Ошибка загрузки данных</h2>";
      }
    })
    .catch(err => {
      console.error("Ошибка загрузки JSON:", err);
      document.body.innerHTML = `<h2>Ошибка загрузки данных</h2><p>${err.message}</p>`;
    });

  function renderProperty(prop, folder) {
    const mainPhoto = document.querySelector(".main-photo img");
    const thumbsContainer = document.querySelector(".thumbnails");
    const prevBtn = document.querySelector(".gallery-arrow.left");
    const nextBtn = document.querySelector(".gallery-arrow.right");

    let currentIndex = 0;

    // Если нет изображений — graceful fallback
    if (!Array.isArray(prop.images) || prop.images.length === 0) {
      mainPhoto.src = "";
      thumbsContainer.innerHTML = "";
    } else {
      const firstImagePath = encodePathPreserveSlashes(prop.images[currentIndex].src);
      mainPhoto.src = `${RAW_BASE}/${folder}/${firstImagePath}`;

      thumbsContainer.innerHTML = "";
      prop.images.forEach((img, index) => {
        const thumb = document.createElement("img");
        const imagePath = encodePathPreserveSlashes(img.src);
        thumb.src = `${RAW_BASE}/${folder}/${imagePath}`;
        thumb.alt = img.alt || "photo";
        if (index === 0) thumb.classList.add("active");
        thumb.addEventListener("click", () => {
          currentIndex = index;
          updateGallery();
        });
        thumbsContainer.appendChild(thumb);
      });

      function updateGallery() {
        const currentImagePath = encodePathPreserveSlashes(prop.images[currentIndex].src);
        mainPhoto.src = `${RAW_BASE}/${folder}/${currentImagePath}`;
        document.querySelectorAll(".thumbnails img").forEach((imgEl, i) => {
          imgEl.classList.toggle("active", i === currentIndex);
        });
      }

      // стрелки
      if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => {
          currentIndex = (currentIndex - 1 + prop.images.length) % prop.images.length;
          updateGallery();
        });
        nextBtn.addEventListener("click", () => {
          currentIndex = (currentIndex + 1) % prop.images.length;
          updateGallery();
        });
      }
    }

    // Инфо-блок
    const infoBar = document.getElementById("info-bar");
    infoBar.innerHTML = `
      <div class="info-item"><p class="label">Plotas</p><p class="value">${prop.M2 || ""}</p></div>
      <div class="info-item"><p class="label">Aukštai</p><p class="value">${prop.TotalFloors || ""}</p></div>
      <div class="info-item"><p class="label">Miegamieji</p><p class="value">${prop.Bedroom || ""}</p></div>
      <div class="info-item"><p class="label">Sklypo plotas</p><p class="value">${prop.ZonaM2 || ""}</p></div>
      <div class="info-item"><p class="label">Vonios k.</p><p class="value">${prop.Bathroom || ""}</p></div>
      <div class="info-item price"><p class="label">Kaina</p><p class="value">${prop.Price || ""}</p></div>
      <div class="button-wrapper"><a href="tel:+37068349117"><button class="contact-button">Susisiekite</button></a></div>
    `;

    // Описание
    const descBlock = document.getElementById("description-block");
    descBlock.innerHTML = `
      <h1>${prop.Name || ""}</h1>
      <h3>${prop.text1 || ""}</h3>
      <p>${prop.descrizione || ""}</p>
      <p>${prop.text3 || ""}</p>
      <p>${prop.text4 || ""}</p>
      <h3>${prop.textFinal || ""}</h3>
    `;
  }
});
