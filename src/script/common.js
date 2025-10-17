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

  
// i18n.js

let translations = {};
let currentLang = 'lt'; // По умолчанию литовский

async function loadTranslations() {
  try {
    const res = await fetch('/script/statick.json');
    translations = await res.json();

    // Проверяем, есть ли переводы для 'lt'
    if (!translations.lt) {
      console.error("Переводы для 'lt' не найдены в statick.json");
      return;
    }

    // Берем язык из localStorage
    let savedLang = localStorage.getItem('lang');

    // Если в localStorage есть валидный язык — используем его
    if (savedLang && translations[savedLang]) {
      currentLang = savedLang;
    } else {
      // Если нет или невалидный — ставим 'lt' по умолчанию
      currentLang = 'lt';
    }

    // Применяем переводы
    applyTranslations();

  } catch (error) {
    console.error('Ошибка загрузки перевода:', error);
  }
}

function getTranslatedValue(entry, key, lang) {
  const value = entry?.translations?.[lang]?.[key];
  if (value && value.trim()) return value;
  return entry?.original?.[key] || "";
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang]?.[key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang]?.[key]) {
      el.setAttribute('placeholder', translations[currentLang][key]);
    }
  });

  document.querySelectorAll('[data-i18n-value]').forEach(el => {
    const key = el.getAttribute('data-i18n-value');
    if (translations[currentLang]?.[key]) {
      el.dataset.i18nValueTranslated = translations[currentLang][key];
    }
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (translations[currentLang]?.[key]) {
      el.setAttribute('alt', translations[currentLang][key]);
    }
  });
}

// Вызываем загрузку переводов после полной загрузки страницы
document.addEventListener('DOMContentLoaded', loadTranslations);

document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.getElementById('lang-switcher');
  if (switcher) {
    // Обновляем селектор на текущий язык (который уже определён в loadTranslations)
    switcher.value = currentLang;

    switcher.addEventListener('change', () => {
      const selectedLang = switcher.value;
      if (translations[selectedLang]) {
        currentLang = selectedLang;
        localStorage.setItem('lang', selectedLang);
        applyTranslations();

        // Важное обновление динамического контента
        const langEvent = new CustomEvent("languageChanged");
        window.dispatchEvent(langEvent);
      }
    });
  }
});