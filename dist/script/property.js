document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const src = params.get("src") || "villa";

  const allowedFolders = ["villa", "sold", "rent", "appart"];
  if (!allowedFolders.includes(src)) {
    document.body.innerHTML = "<h2>Invalid source folder</h2>";
    return;
  }

  fetch(`https://raw.githubusercontent.com/AisteSito/AisteCMS/main/${src}/${src}.json`)
    .then(res => res.json())
    .then(data => {
      const property = data.find(item => item.slug === slug);
      if (!property) {
        document.body.innerHTML = "<h2>Property not found</h2>";
        return;
      }
      renderProperty(property, src);
    })
    .catch(err => console.error("Ошибка загрузки JSON:", err));

  function renderProperty(prop, folder) {
    const mainPhoto = document.querySelector(".main-photo img");
    const thumbsContainer = document.querySelector(".thumbnails");
    const prevBtn = document.querySelector(".gallery-arrow.left");
    const nextBtn = document.querySelector(".gallery-arrow.right");

    let currentIndex = 0;

    // Убираем лишние пробелы и кодируем путь
    const firstImage = prop.images[currentIndex].src;
    mainPhoto.src = `https://raw.githubusercontent.com/AisteSito/AisteCMS/main/${folder}/${encodeURIComponent(firstImage)}`;
    thumbsContainer.innerHTML = "";

    prop.images.forEach((img, index) => {
      const thumb = document.createElement("img");
      const imagePath = img.src;
      thumb.src = `https://raw.githubusercontent.com/AisteSito/AisteCMS/main/${folder}/${encodeURIComponent(imagePath)}`;
      thumb.alt = img.alt || "photo";
      if (index === 0) thumb.classList.add("active");
      thumb.addEventListener("click", () => {
        currentIndex = index;
        updateGallery();
      });
      thumbsContainer.appendChild(thumb);
    });

    function updateGallery() {
      const currentImage = prop.images[currentIndex].src;
      mainPhoto.src = `https://raw.githubusercontent.com/AisteSito/AisteCMS/main/${folder}/${encodeURIComponent(currentImage)}`;
      document.querySelectorAll(".thumbnails img").forEach((img, i) => {
        img.classList.toggle("active", i === currentIndex);
      });
    }

    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + prop.images.length) % prop.images.length;
      updateGallery();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % prop.images.length;
      updateGallery();
    });

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