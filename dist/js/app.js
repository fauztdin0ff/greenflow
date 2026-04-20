/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "burgerMenu": () => (/* binding */ burgerMenu),
/* harmony export */   "isWebp": () => (/* binding */ isWebp),
/* harmony export */   "phoneMask": () => (/* binding */ phoneMask),
/* harmony export */   "popups": () => (/* binding */ popups)
/* harmony export */ });
/*---------------------------------------------------------------------------
Проверка WebP
---------------------------------------------------------------------------*/
function isWebp() {
   function testWebP(callback) {
      const webP = new Image();
      webP.onload = webP.onerror = function () {
         callback(webP.height === 2);
      };
      webP.src =
         "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
   }

   testWebP(function (support) {
      document.body.classList.add(support ? "webp" : "no-webp");
   });
}


/*---------------------------------------------------------------------------
Маска телефона
---------------------------------------------------------------------------*/
function phoneMask() {
   document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("input.tel-mask").forEach((input) => {
         let keyCode;
         function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            let pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            let matrix = "+7 (___) ___ __ __",
               i = 0,
               val = this.value.replace(/\D/g, ""),
               new_value = matrix.replace(/[_\d]/g, (a) =>
                  i < val.length ? val.charAt(i++) : a
               );
            i = new_value.indexOf("_");
            if (i !== -1) {
               i < 5 && (i = 3);
               new_value = new_value.slice(0, i);
            }
            let reg = matrix
               .substr(0, this.value.length)
               .replace(/_+/g, (a) => `\\d{1,${a.length}}`)
               .replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || (keyCode > 47 && keyCode < 58)) {
               this.value = new_value;
            }
            if (event.type === "blur" && this.value.length < 5) this.value = "";
         }

         input.addEventListener("input", mask);
         input.addEventListener("focus", mask);
         input.addEventListener("blur", mask);
         input.addEventListener("keydown", mask);
      });
   });
}


/*---------------------------------------------------------------------------
Бургер меню
---------------------------------------------------------------------------*/
function burgerMenu() {
   document.addEventListener("DOMContentLoaded", () => {
      const menuIcon = document.querySelector(".menu__icon");
      const menuBody = document.querySelector(".menu__body");
      const menuBodyClose = document.querySelector(".menu__body-close");
      const overlay = document.querySelector(".overlay");

      const body = document.body;
      const html = document.documentElement;

      const animationDuration = 500;

      if (!menuIcon || !menuBody) return;

      const setSafariBackdrop = (state) => {
         if (state) {
            html.style.backgroundColor = "#fbfbfb";
            body.style.backgroundColor = "#fbfbfb";
         } else {
            html.style.backgroundColor = "";
            body.style.backgroundColor = "";
         }
      };

      const closeMenu = () => {
         menuIcon.classList.remove("active");
         menuBody.classList.remove("active");
         body.classList.remove("no-scroll");
         html.classList.remove("no-scroll");

         if (overlay) overlay.classList.remove("active");

         setSafariBackdrop(false);
      };

      const openMenu = () => {
         menuIcon.classList.add("active");
         menuBody.classList.add("active");
         body.classList.add("no-scroll");
         html.classList.add("no-scroll");

         if (overlay) overlay.classList.add("active");

         setSafariBackdrop(true);
      };

      menuIcon.addEventListener("click", () => {
         const isOpen = menuBody.classList.contains("active");

         if (isOpen) {
            closeMenu();
         } else {
            openMenu();
         }
      });

      menuBody.addEventListener("click", (e) => {
         const link = e.target.closest("a");

         if (link) {
            e.preventDefault();
            closeMenu();

            setTimeout(() => {
               window.location.href = link.href;
            }, animationDuration);
         }
      });

      if (menuBodyClose) {
         menuBodyClose.addEventListener("click", closeMenu);
      }

      if (overlay) {
         overlay.addEventListener("click", closeMenu);
      }

      document.addEventListener("click", (e) => {
         if (
            !menuBody.contains(e.target) &&
            !menuIcon.contains(e.target) &&
            (!overlay || !overlay.contains(e.target))
         ) {
            closeMenu();
         }
      });
   });
}



/*---------------------------------------------------------------------------
Попапы
---------------------------------------------------------------------------*/
function popups() {
   if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initPopups);
   } else {
      initPopups();
   }
}

function initPopups() {
   const POPUP_SELECTOR = ".popup";
   const OPEN_BTN_SELECTOR = ".open-popup";
   const ACTIVE_CLASS = "show";
   const BODY_ACTIVE_CLASS = "popup-opened";

   let activeButton = null;

   // =========================
   // OPEN / SWITCH POPUPS
   // =========================
   document.addEventListener("click", (e) => {
      const button = e.target.closest(OPEN_BTN_SELECTOR);
      if (!button) return;

      e.preventDefault();
      e.stopPropagation();

      const popupId = button.dataset.popup;
      if (!popupId) return;

      const popup = document.getElementById(popupId);
      if (!popup) return;

      const currentPopup = document.querySelector(
         `${POPUP_SELECTOR}.${ACTIVE_CLASS}`
      );

      if (activeButton === button && currentPopup) {
         closePopup(currentPopup);
         return;
      }

      if (currentPopup) {
         closePopup(currentPopup);
      }

      openPopup(popup, button);
   });

   // =========================
   // CLOSE POPUPS (overlay / close btn / outside)
   // =========================
   document.addEventListener("click", (e) => {
      const openPopupEl = document.querySelector(
         `${POPUP_SELECTOR}.${ACTIVE_CLASS}`
      );
      if (!openPopupEl) return;

      if (e.target.closest(OPEN_BTN_SELECTOR)) return;

      const isCloseBtn = e.target.closest(".popup__close");
      const isInsideBody = e.target.closest(".popup__body");

      if (isCloseBtn || !isInsideBody) {
         closePopup(openPopupEl);
      }
   });

   // =========================
   // ESC KEY
   // =========================
   document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;

      const openPopupEl = document.querySelector(
         `${POPUP_SELECTOR}.${ACTIVE_CLASS}`
      );
      if (!openPopupEl) return;

      closePopup(openPopupEl);
   });

   // =========================
   // HELPERS
   // =========================
   function openPopup(popup, button) {
      popup.classList.add(ACTIVE_CLASS);
      document.body.classList.add(BODY_ACTIVE_CLASS);

      if (button) {
         button.classList.add("active");
         activeButton = button;
      }
   }

   function closePopup(popup) {
      popup.classList.remove(ACTIVE_CLASS);
      document.body.classList.remove(BODY_ACTIVE_CLASS);

      if (activeButton) {
         activeButton.classList.remove("active");
         activeButton = null;
      }
   }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_functions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


_modules_functions_js__WEBPACK_IMPORTED_MODULE_0__.isWebp();
_modules_functions_js__WEBPACK_IMPORTED_MODULE_0__.burgerMenu();
_modules_functions_js__WEBPACK_IMPORTED_MODULE_0__.popups();
_modules_functions_js__WEBPACK_IMPORTED_MODULE_0__.phoneMask();

/*==========================================================================
Marque slider
============================================================================*/
function initMarqueeSplide() {
   const slider = document.querySelector('.marque__slider');
   if (!slider) return;

   const list = slider.querySelector('.splide__list');
   if (!list) return;

   const slides = list.children;
   const currentSlides = slides.length;
   if (!currentSlides) return;

   const MIN_SLIDES = 12;

   if (currentSlides < MIN_SLIDES) {
      const fragment = document.createDocumentFragment();
      const times = Math.ceil(MIN_SLIDES / currentSlides);

      for (let i = 0; i < times; i++) {
         [...slides].forEach(slide => {
            fragment.appendChild(slide.cloneNode(true));
         });
      }

      list.appendChild(fragment);
   }

   const splide = new Splide(slider, {
      type: 'loop',
      drag: false,
      arrows: false,
      pagination: false,
      autoWidth: true,
      gap: '10px',

      breakpoints: {
         768: {
            gap: '6px',
         },
      },

      autoScroll: {
         speed: 0.7,
         pauseOnHover: false,
         pauseOnFocus: false,
      },
   });

   const { AutoScroll } = window.splide.Extensions;
   splide.mount({ AutoScroll });
}


/*==========================================================================
faq
============================================================================*/
function initFaqAccordion() {
   const faqItems = document.querySelectorAll('.faq__item');
   if (!faqItems.length) return;

   faqItems.forEach(item => {
      const question = item.querySelector('.faq__question');
      const answer = item.querySelector('.faq__answer');

      if (!question || !answer || item.dataset.inited) return;

      question.addEventListener('click', () => {
         const isActive = item.classList.contains('active');

         faqItems.forEach(el => {
            const elAnswer = el.querySelector('.faq__answer');
            if (!elAnswer) return;

            el.classList.remove('active');
            elAnswer.style.maxHeight = null;
         });

         if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
         }
      });

      item.dataset.inited = 'true';
   });
}

/*==========================================================================
Quantity
============================================================================*/
function initQuantity(root = document) {
   root.addEventListener('click', function (e) {
      const minusBtn = e.target.closest('.quantity__minus');
      const plusBtn = e.target.closest('.quantity__plus');

      if (!minusBtn && !plusBtn) return;

      const quantity = e.target.closest('.quantity');
      if (!quantity) return;

      const input = quantity.querySelector('input');
      if (!input) return;

      let value = parseInt(input.value) || 1;

      const min = parseInt(input.dataset.min) || 1;
      const max = parseInt(input.dataset.max) || Infinity;

      if (minusBtn) {
         value = Math.max(min, value - 1);
      }

      if (plusBtn) {
         value = Math.min(max, value + 1);
      }

      input.value = value;

      input.dispatchEvent(new Event('change', { bubbles: true }));

      const updateBtn = document.querySelector('button[name="update_cart"]');

      updateBtn.removeAttribute('disabled');
      setTimeout(() => {
         updateBtn.click();
      }, 100)

      updateBtn.removeAttribute('disabled');
      setTimeout(() => {
         updateBtn.click();
      }, 100)

   });
}


/*==========================================================================
Valid input
============================================================================*/
function initInputFocusClear(root = document) {
   root.addEventListener('focusin', function (e) {
      const input = e.target.closest('input, textarea');
      if (!input) return;

      input.classList.remove('no-valid');

      const parent = input.parentElement;
      if (parent) {
         parent.classList.remove('no-valid');

         const errorText = parent.querySelector('.error-text');
         if (errorText) {
            errorText.style.display = 'none';
         }
      }
   });
}


/*==========================================================================
Avatar upload 
============================================================================*/
function initAvatarUpload() {
   const input = document.getElementById('avatarInput');
   const preview = document.getElementById('avatarPreview');

   if (!input || !preview) return;

   input.addEventListener('change', function () {
      const file = this.files[0];

      if (!file) return;

      if (!file.type.startsWith('image/')) {
         alert('Можно загружать только изображения');
         input.value = '';
         return;
      }

      if (file.size > 2 * 1024 * 1024) {
         alert('Файл слишком большой (макс 2MB)');
         input.value = '';
         return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
         preview.src = e.target.result;
      };
      reader.readAsDataURL(file);
   });
}


/*==========================================================================
Form valid
============================================================================*/
function enableSaveOnChange(formSelector, buttonSelector) {
   const form = document.querySelector(formSelector);
   const button = document.querySelector(buttonSelector);

   if (!form || !button) return;

   const activateButton = () => {
      button.disabled = false;
   };

   form.addEventListener('input', activateButton);
   form.addEventListener('change', activateButton);
}


/*==========================================================================
Copy text
============================================================================*/
function initCopyText() {
   document.addEventListener('click', async (e) => {
      const btn = e.target.closest('.copytext-btn');
      if (!btn) return;

      const container = btn.closest('.copytext');
      const textEl = container.querySelector('.copytext-val');
      const useEl = btn.querySelector('use');

      if (!textEl || !useEl) return;

      const text = textEl.textContent.trim();
      const originalIcon = 'img/icons/icons.svg#icon-copy';
      const successIcon = 'img/icons/icons.svg#icon-check';

      try {
         await navigator.clipboard.writeText(text);

         btn.classList.add('copied');
         useEl.setAttribute('xlink:href', successIcon);

         setTimeout(() => {
            btn.classList.remove('copied');
            useEl.setAttribute('xlink:href', originalIcon);
         }, 1000);

      } catch (err) {
         console.error('Ошибка копирования:', err);
      }
   });
}


/*==========================================================================
Show password
============================================================================*/
function initPasswordToggle() {
   const areas = document.querySelectorAll('.popup__form-area');

   areas.forEach(area => {
      if (area.dataset.passInit) return;
      area.dataset.passInit = 'true';

      const input = area.querySelector('input');
      const eye = area.querySelector('.popup__form-eyes');

      if (!input || !eye) return;

      eye.addEventListener('click', (e) => {
         e.preventDefault();

         const isHidden = input.type === 'password';

         input.type = isHidden ? 'text' : 'password';
         area.classList.toggle('pass-visible', isHidden);
      });
   });
}

/*==========================================================================
Cookies
============================================================================*/
(function () {
   const banner = document.getElementById('cookieBanner');
   const acceptBtn = document.getElementById('cookieAccept');
   const closeBtn = document.getElementById('cookieClose');
   const STORAGE_KEY = 'cookie_consent';

   if (!banner || !acceptBtn || !closeBtn) return;

   if (localStorage.getItem(STORAGE_KEY)) return;

   setTimeout(() => {
      banner.classList.add('show');
   }, 500);

   function hideBanner() {
      banner.classList.remove('show');
   }

   acceptBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      hideBanner();
   });

   closeBtn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'closed');
      hideBanner();
   });

})();

/*==========================================================================
Editable text + auto resize
============================================================================*/
function autoResizeTextarea(textarea) {
   textarea.style.height = 'auto';
   textarea.style.height = textarea.scrollHeight + 'px';
}

function initEditableTextarea() {
   document.addEventListener('click', (e) => {
      const btn = e.target.closest('.editable__btn');
      if (!btn) return;

      e.preventDefault();

      const wrapper = btn.closest('.editable');
      const textarea = wrapper.querySelector('.editable__text');

      if (!textarea) return;

      textarea.removeAttribute('readonly');

      textarea.focus();

      textarea.setSelectionRange(
         textarea.value.length,
         textarea.value.length
      );

      autoResizeTextarea(textarea);
   });

   document.addEventListener('focusout', async (e) => {
      const textarea = e.target.closest('.editable__text');
      if (!textarea) return;

      const wrapper = textarea.closest('.editable');
      const related = e.relatedTarget;

      if (related && wrapper.contains(related)) return;

      textarea.setAttribute('readonly', true);
   });

   document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;

      const textarea = document.activeElement;
      if (!textarea.classList.contains('editable__text')) return;

      textarea.setAttribute('readonly', true);
      textarea.blur();
   });
}

/*==========================================================================
Auto resize
============================================================================*/
function initAutoResize() {
   document.addEventListener('input', (e) => {
      const textarea = e.target.closest('.editable__text');
      if (!textarea) return;

      autoResizeTextarea(textarea);
   });

   document.addEventListener('focusin', (e) => {
      const textarea = e.target.closest('.editable__text');
      if (!textarea) return;

      autoResizeTextarea(textarea);
   });

   document.querySelectorAll('.editable__text').forEach(autoResizeTextarea);
}


/*==========================================================================
Solutions anim
============================================================================*/
function initSolutionsScrollSlider() {
   const section = document.querySelector(".solutions");
   if (!section) return;

   const images = section.querySelectorAll(".solutions__image");
   if (!images.length) return;

   const total = images.length;

   let step = window.innerHeight;

   const startOffset = window.innerHeight * 0.3;
   // ↑ задержка 30% экрана (настраивается)

   let currentIndex = 0;

   function setClasses(index) {
      images.forEach((img, i) => {
         img.classList.remove("is-active", "is-prev", "is-next");

         if (i === index) img.classList.add("is-active");
         else if (i < index) img.classList.add("is-prev");
         else img.classList.add("is-next");
      });
   }

   function update() {
      const rect = section.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      let progress = window.innerHeight - rect.top;

      // 🔥 ключевая строка — отсрочка старта
      progress = Math.max(0, progress - startOffset);

      let index = Math.floor(progress / step);

      index = Math.max(0, Math.min(total - 1, index));

      if (index !== currentIndex) {
         currentIndex = index;
         setClasses(currentIndex);
      }
   }

   function onResize() {
      step = window.innerHeight;
      update();
   }

   window.addEventListener("scroll", update, { passive: true });
   window.addEventListener("resize", onResize);

   setClasses(0);
   update();
}


/*==========================================================================
Hover steps
============================================================================*/
function initInstallSteps() {
   const sections = document.querySelectorAll('.start');

   sections.forEach(section => {
      const steps = section.querySelectorAll('.install__step');
      if (!steps.length) return;

      let activeStep = steps[0];

      function setActive(step) {
         if (activeStep === step) return;

         activeStep.classList.remove('active');
         const prevContent = activeStep.querySelector('.install__step-content');
         if (prevContent) prevContent.style.maxHeight = '0px';

         activeStep = step;
         activeStep.classList.add('active');

         const content = activeStep.querySelector('.install__step-content');
         if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
         }
      }

      // init first open
      steps.forEach(step => {
         const content = step.querySelector('.install__step-content');
         if (content) content.style.maxHeight = '0px';
         step.classList.remove('active');
      });

      activeStep.classList.add('active');
      const firstContent = activeStep.querySelector('.install__step-content');
      if (firstContent) {
         firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
      }

      // hover behavior
      steps.forEach(step => {
         step.addEventListener('mouseenter', () => {
            setActive(step);
         });
      });
   });
}


/*==========================================================================
Videos
============================================================================*/
function initVideoPlayers() {
   const players = document.querySelectorAll('.player');
   if (!players.length) return;

   players.forEach(player => {
      const video = player.querySelector('.player__video');
      const button = player.querySelector('.player__button');

      if (!video || !button) return;

      button.addEventListener('click', () => {
         video.play();
         video.setAttribute('controls', 'controls');
         button.style.display = 'none';
      });
   });
}


/*==========================================================================
Reviews slider
============================================================================*/
function initReviewsSlider() {
   const slider = document.querySelector('.reviews__slider');

   if (!slider || typeof Splide === 'undefined') return;

   const splide = new Splide(slider, {
      type: 'loop',
      perPage: 1,
      autoWidth: true,
      gap: '24px',
      pagination: false,
      arrows: false,
      drag: true,
      rewind: true,
      breakpoints: {
         550: {
            gap: '8px',
         },
      },
   });

   splide.mount();

   const prevBtn = document.querySelector('.reviews__slider-prev');
   const nextBtn = document.querySelector('.reviews__slider-next');

   if (prevBtn) {
      prevBtn.addEventListener('click', () => splide.go('<'));
   }

   if (nextBtn) {
      nextBtn.addEventListener('click', () => splide.go('>'));
   }
}


/*==========================================================================
Init
============================================================================*/
document.addEventListener('DOMContentLoaded', () => {
   initFaqAccordion();
   initQuantity();
   initInputFocusClear();
   initAvatarUpload();
   enableSaveOnChange('.cabinet__profile-form', '#saveChanges');
   initCopyText();
   initPasswordToggle();
   initEditableTextarea();
   initAutoResize();
   initMarqueeSplide();
   initSolutionsScrollSlider();
   initInstallSteps();
   initVideoPlayers();
   initReviewsSlider();
});




})();

/******/ })()
;