let lastScrollTop = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 100) {
        // Скролл вниз
        header.classList.add('header-hidden');
    } else {
        // Скролл вверх
        header.classList.remove('header-hidden');
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Не даём отрицательных значений
});


document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownItem = document.querySelector('.dropdown-item');

    // Переключаем класс active при клике
    dropdownToggle.addEventListener('click', function (e) {
        e.preventDefault(); // Предотвращаем переход по ссылке
        dropdownItem.classList.toggle('active');
    });

    // Закрываем выпадающий блок при клике вне его
    document.addEventListener('click', function (e) {
        if (!dropdownItem.contains(e.target)) {
            dropdownItem.classList.remove('active');
        }
    });
});

function toggleMenu() {
    const nav = document.querySelector(".mobile-nav");
    const burger = document.querySelector(".burger-menu");
    nav.classList.toggle("nav-active");
    burger.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const langSwitcher = document.getElementById("lang-switcher");

  if (langSwitcher) {
    langSwitcher.addEventListener("change", function () {
      const lang = langSwitcher.value;

      const googSelector = document.querySelector(".goog-te-combo");
      if (googSelector) {
        googSelector.value = lang;
        googSelector.dispatchEvent(new Event("change"));
      }
    });
  }
});



// Загружаем переводы и применяем
function loadAndApplyTranslations(lang) {
  fetch('/translate_static.json')
    .then(res => res.json())
    .then(translations => {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = translations[key]?.[lang];
        if (translated && translated.trim() !== '') {
          el.textContent = translated;
        }
      });
    });
}

// Применяем язык при загрузке
document.addEventListener('DOMContentLoaded', function () {
  const lang = localStorage.getItem('lang') || 'cs';
  window.currentLang = localStorage.getItem('lang') || 'cs';
  loadAndApplyTranslations(lang);
});

document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.getElementById('lang-switcher');
  const currentLang = localStorage.getItem('lang') || 'cs';

  if (switcher) {
    switcher.value = currentLang;

    switcher.addEventListener('change', () => {
      const selectedLang = switcher.value;
      localStorage.setItem('lang', selectedLang);
      window.currentLang = selectedLang;

      // Применяем переводы
      loadAndApplyTranslations(selectedLang);

      // Вызываем событие
      const langEvent = new CustomEvent("languageChanged");
      window.dispatchEvent(langEvent);
    });
  }
});



  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector(".dropdown-toggle");
    const dropdown = document.querySelector(".dropdown-contacts");

    // Закрыть при клике вне
    document.addEventListener("click", function (e) {
      if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });

    // Тоггл по клику
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });
  });

  