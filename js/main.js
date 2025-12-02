// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     FOOTER: page detection + dynamic messages
     ======================================================================== */

  const footer = document.querySelector(".js-footer");
  const footerText = footer?.querySelector("#footer-text");

  if (!footer || !footerText) return;

  footer.classList.add("site-footer--theme-1");

  const body = document.body;
  let pageKey = "default";

  if (body.classList.contains("page--home")) pageKey = "home";
  else if (body.classList.contains("page--collection")) pageKey = "collection";
  else if (body.classList.contains("page--wishlist")) pageKey = "wishlist";
  else if (body.classList.contains("page--seen-live")) pageKey = "seen";
  else if (body.classList.contains("page--about")) pageKey = "about";
  else if (body.classList.contains("page--404")) pageKey = "error";
  else if (body.classList.contains("page--album")) pageKey = "album";

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
      "--- warning: may cause sudden Discogs searches ---"
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

  const hiJackie =
    "--- hi jackie! you scrolled all the way down again, didn’t you? ---";

  const globalEggs = [
    "--- rare pressing unlocked: you found the secret footer ---",
    "--- hidden track: this line only appears sometimes ---",
    "--- you discovered the bonus liner note at the bottom of the page ---"
  ];

  const base = "© 2025 Vivi’s Record Room. ";
  const roll = Math.random();

  let chosenMessage;

  if (roll < 0.02) {
    chosenMessage = globalEggs[Math.floor(Math.random() * globalEggs.length)];
  } else if (roll < 0.06) {
    chosenMessage = hiJackie;
  } else {
    chosenMessage = messages[Math.floor(Math.random() * messages.length)];
  }

  footerText.textContent = base + chosenMessage;

  /* ========================================================================
     COLLECTION PAGE: dynamic list, filtering, sorting
     ======================================================================== */

  if (pageKey === "collection") {
    const grid = document.querySelector(".js-collection-grid");
    const searchInput = document.querySelector("#search");
    const formatSelect = document.querySelector("#format");
    const sortSelect = document.querySelector("#sort");

    if (grid) {
      // ---- Your CD data lives here ---- //
      const records = [
        {
          id: "totbl",
          title: "Turn on the Bright Lights",
          artist: "Interpol",
          format: "cd",
          year: 2002,
          label: "Matador",
          tags: ["yearning", "desperation dressed up as detachment"],
          href: "albums/turn-on-the-bright-lights.html",
          cover: "images/albums/totbl/totbl-cover.jpg",
          notes: "Core memory record."
        }
        // Add more objects here as you build your collection
      ];

      // Track order of addition
      records.forEach((r, i) => (r.addedIndex = i));

      function createRecordCard(r) {
        const el = document.createElement("a");
        el.className = "record-card record-card--link";
        el.href = r.href;
        el.dataset.format = r.format;

        el.innerHTML = `
          <figure class="record-card__art">
            <img src="${r.cover}" alt="Album cover for ${r.artist} – ${r.title}">
          </figure>
          <div class="record-card__info">
            <h3 class="record-card__title">${r.title}</h3>
            <p class="record-card__artist">${r.artist}</p>
            <p class="record-card__meta">
              ${r.label} · ${r.year}<br>
              Tags: ${r.tags.join(", ")}
            </p>
          </div>
        `;

        return el;
      }

      function filterAndSort() {
        const q = (searchInput?.value || "").trim().toLowerCase();
        const fmt = formatSelect?.value || "";
        const sort = sortSelect?.value || "artist";

        let out = records.filter((r) => {
          if (fmt && r.format !== fmt) return false;

          if (q) {
            const hay = [
              r.title,
              r.artist,
              r.label,
              r.tags.join(" "),
              r.notes
            ]
              .join(" ")
              .toLowerCase();
            if (!hay.includes(q)) return false;
          }

          return true;
        });

        if (sort === "artist") out.sort((a, b) => a.artist.localeCompare(b.artist));
        else if (sort === "year") out.sort((a, b) => a.year - b.year);
        else if (sort === "added") out.sort((a, b) => a.addedIndex - b.addedIndex);

        return out;
      }

      function render(list) {
        grid.innerHTML = "";
        list.forEach((r) => grid.appendChild(createRecordCard(r)));
      }

      const update = () => render(filterAndSort());

      searchInput?.addEventListener("input", update);
      formatSelect?.addEventListener("change", update);
      sortSelect?.addEventListener("change", update);

      render(records);
    }
  }

  /* ========================================================================
     ALBUM PAGE: lightbox / darkroom
     ======================================================================== */

  const galleryRoot = document.querySelector(".album-gallery");
  const thumbs = galleryRoot
    ? galleryRoot.querySelectorAll(".js-album-thumb")
    : [];

  if (thumbs.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "album-lightbox";
    lightbox.innerHTML = `
      <div class="album-lightbox__inner" role="dialog" aria-modal="true" aria-label="Album photo">
        <div class="album-lightbox__image-wrap">
          <button type="button" class="album-lightbox__close">
            <span class="visually-hidden">Close</span>×
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

    function openAt(i) {
      const t = thumbArray[i];
      if (!t) return;

      activeIndex = i;

      const fullSrc =
        t.getAttribute("data-album-full") || t.getAttribute("src");
      const alt = t.getAttribute("alt") || "";
      const fig = t.closest("figure");
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

    thumbArray.forEach((t, i) => {
      t.tabIndex = 0;
      t.addEventListener("click", (e) => {
        e.preventDefault();
        openAt(i);
      });
      t.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openAt(i);
        }
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-active")) return;

      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight")
        openAt((activeIndex + 1) % thumbArray.length);
      else if (e.key === "ArrowLeft")
        openAt((activeIndex - 1 + thumbArray.length) % thumbArray.length);
    });
  }
});
