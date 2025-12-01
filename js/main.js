// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".js-footer");
  const footerText = footer?.querySelector("#footer-text");

  if (!footer || !footerText) return;

  // Always use the subtle theme-1 (no wild color switching)
  footer.classList.add("site-footer--theme-1");

  // determine page type from body classes
  const body = document.body;
  let pageKey = "default";

  if (body.classList.contains("page--home")) pageKey = "home";
  else if (body.classList.contains("page--collection")) pageKey = "collection";
  else if (body.classList.contains("page--wishlist")) pageKey = "wishlist";
  else if (body.classList.contains("page--seen-live")) pageKey = "seen";
  else if (body.classList.contains("page--about")) pageKey = "about";
  else if (body.classList.contains("page--404")) pageKey = "error";
  else if (body.classList.contains("page--album")) pageKey = "album";

  // normal footer messages per page type
  const footerMessages = {
    home: [
      "--- scratched but still playable --- now loading another obsession.",
      "--- welcome to the stacks --- please reshelve your feelings by artist.",
      "--- filed under: beautifully unwell --- thanks for stopping by.",
      "--- liminal listening room --- mind the emotional feedback."
    ],
    collection: [
      "--- inventory not guaranteed accurate --- I definitely forgot a few CDs.",
      "--- filed by vibe, not logic --- browse at your own risk.",
      "--- shelf status: overflowing --- send help or new jewel cases.",
      "--- warning: may cause sudden discogs searches ---"
    ],
    wishlist: [
      "--- manifesting rare pressings --- delusion is a collecting strategy.",
      "--- ISO: sleep & affordable shipping ---",
      "--- wanted: grails, patience, store credit ---",
      "--- this wall is 90% hope, 10% eBay saved searches ---"
    ],
    seen: [
      "--- ears still ringing --- will not be seeking medical advice.",
      "--- live log: emotionally compromised, sonically blessed ---",
      "--- crowd control failed --- feelings spilled into the pit.",
      "--- status: not okay but vibing --- thanks for attending the show."
    ],
    about: [
      "--- built with html, caffeine, and questionable choices ---",
      "--- author: vivi, currently buffering ---",
      "--- this is the 'about' page but it’s mostly feelings ---",
      "--- handcrafted front-end, industrial-grade overthinking ---"
    ],
    error: [
      "--- 404: lost in the stacks --- check behind the misfiled promos.",
      "--- this page fell behind the shelf --- please send a step stool.",
      "--- missing: this url & my limited edition pressing ---",
      "--- error bin: where broken links and b-sides go to hide ---"
    ],
    album: [
      "--- all opinions here are correct and emotionally charged ---",
      "--- filed under: core memory --- handle with care.",
      "--- playback: side A, track 1 --- emotional damage imminent.",
      "--- liner notes for my brain --- thanks for reading the fine print."
    ],
    default: [
      "--- site footer, but make it existential ---",
      "--- nothing to see here except everything ---",
      "--- if you’re reading this, you scrolled too far ---",
      "--- static, crackle, and one last line of text ---"
    ]
  };

  const messages = footerMessages[pageKey] || footerMessages.default;

  const hiJackie = "--- hi jackie! you scrolled all the way down again, didn’t you? ---";

  const globalEggs = [
    "--- rare pressing unlocked: you found the secret footer ---",
    "--- hidden track: this line only appears sometimes ---",
    "--- you discovered the bonus liner note at the bottom of the page ---"
  ];

  const base = "© 2025 Vivi’s Record Room. ";

  // roll the dice for easter eggs
  const roll = Math.random();
  let chosenMessage;

  if (roll < 0.02) {
    // ~2% chance: global easter egg
    chosenMessage =
      globalEggs[Math.floor(Math.random() * globalEggs.length)];
  } else if (roll < 0.06) {
    // next ~4%: hi jackie!
    chosenMessage = hiJackie;
  } else {
    // otherwise: normal page-specific message
    chosenMessage =
      messages[Math.floor(Math.random() * messages.length)];
  }

  footerText.textContent = base + chosenMessage;
});


  // ----- Album lightbox / darkroom view -----
  const galleryRoot = document.querySelector(".album-gallery");
  const thumbs = galleryRoot
    ? galleryRoot.querySelectorAll(".js-album-thumb")
    : [];

  if (thumbs.length) {
    // create lightbox once
    const lightbox = document.createElement("div");
    lightbox.className = "album-lightbox";
    lightbox.innerHTML = `
      <div class="album-lightbox__inner" role="dialog" aria-modal="true" aria-label="Album photo">
        <div class="album-lightbox__image-wrap">
          <button type="button" class="album-lightbox__close">
            <span class="visually-hidden">Close</span>
            ×
          </button>
          <img class="album-lightbox__image" src="" alt="">
        </div>
        <p class="album-lightbox__caption"></p>
      </div>
    `;
    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector(".album-lightbox__image");
    const captionEl = lightbox.querySelector(".album-lightbox__caption");
    const closeBtn = lightbox.querySelector(".album-lightbox__close");

    const thumbArray = Array.from(thumbs);
    let activeIndex = 0;

    function openAt(index) {
      const thumb = thumbArray[index];
      if (!thumb) return;

      activeIndex = index;

      const fullSrc =
        thumb.getAttribute("data-album-full") || thumb.getAttribute("src");
      const alt = thumb.getAttribute("alt") || "";
      const fig = thumb.closest("figure");
      const cap =
        fig && fig.querySelector("figcaption")
          ? fig.querySelector("figcaption").textContent
          : "";

      imgEl.src = fullSrc;
      imgEl.alt = alt;
      captionEl.textContent = cap;

      lightbox.classList.add("is-active");
      document.body.classList.add("album-lightbox-open");
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-active");
      document.body.classList.remove("album-lightbox-open");
    }

    // click + keyboard on thumbs
    thumbArray.forEach((thumb, index) => {
      thumb.setAttribute("tabindex", "0");

      thumb.addEventListener("click", (event) => {
        event.preventDefault();
        openAt(index);
      });

      thumb.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openAt(index);
        }
      });
    });

    // close interactions
    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        // clicking the dark backdrop
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-active")) return;

      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowRight") {
        openAt((activeIndex + 1) % thumbArray.length);
      } else if (event.key === "ArrowLeft") {
        openAt((activeIndex - 1 + thumbArray.length) % thumbArray.length);
      }
    });
  }
