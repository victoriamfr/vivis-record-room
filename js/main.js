// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* ========================================================================
     PAGE DETECTION
     ======================================================================== */

  function getPageKey() {
    if (body.classList.contains("page--home")) return "home";
    if (body.classList.contains("page--collection")) return "collection";
    if (body.classList.contains("page--wishlist")) return "wishlist";
    if (body.classList.contains("page--seen-live")) return "seen";
    if (body.classList.contains("page--about")) return "about";
    if (body.classList.contains("page--404")) return "error";
    if (body.classList.contains("page--album")) return "album";
    return "default";
  }

  const pageKey = getPageKey();

  setupFooter(pageKey);
  if (pageKey === "collection") setupCollectionPage();
  if (pageKey === "album") setupAlbumLightbox();

  /* ========================================================================
     FOOTER: page detection + dynamic messages
     ======================================================================== */

  function setupFooter(pageKey) {
    const footer = document.querySelector(".js-footer");
    const footerText = footer?.querySelector("#footer-text");
    if (!footer || !footerText) return;

    footer.classList.add("site-footer--theme-1");

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
  }

  /* ========================================================================
     COLLECTION PAGE: dynamic list, filtering, sorting
     ======================================================================== */

  function setupCollectionPage() {
    const grid = document.querySelector(".js-collection-grid");
    const searchInput = document.querySelector("#search");
    const formatSelect = document.querySelector("#format");
    const sortSelect = document.querySelector("#sort");

    if (!grid) return;

    // read records from records-data.js
    const baseRecords = Array.isArray(window.VIVI_RECORDS)
      ? window.VIVI_RECORDS
      : [];

    if (!baseRecords.length) {
      console.warn("VIVI_RECORDS is empty or not defined.");
      return;
    }

    // make a shallow copy so we can sort without mutating the original
    const records = baseRecords.slice();

    // helper: slug for CSS classnames (labels)
    function slugify(str) {
      return String(str || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // ensure addedIndex exists (for "date added" sort)
    records.forEach((r, i) => {
      if (typeof r.addedIndex !== "number") {
        r.addedIndex = i;
      }
    });

    function createRecordCard(r) {
      const el = document.createElement("a");
      el.className = "record-card record-card--link";
      el.href = r.href;
      el.dataset.format = r.format || "";

      const formatDisplay =
        r.format === "vinyl" ? "LP" : r.format ? r.format.toUpperCase() : "";
      const formatClass = r.format ? `record-card__format--${r.format}` : "";
      const labelSlug = slugify(r.label);

      el.innerHTML = `
        <figure class="record-card__art">
          <img src="${r.cover}"
               alt="Album cover for ${r.artist} – ${r.title}">
        </figure>

        <div class="record-card__info">
          <div class="record-card__topline">
            ${formatDisplay
          ? `<span class="record-card__format ${formatClass}">${formatDisplay}</span>`
          : ""
        }
            ${r.label
          ? `<span class="record-card__label label-${labelSlug}">${r.label}</span>`
          : ""
        }
            ${r.year
          ? `<span class="record-card__year">${r.year}</span>`
          : ""
        }
          </div>

          <h3 class="record-card__title">${r.title}</h3>
          <p class="record-card__artist">${r.artist}</p>

          <p class="record-card__meta">
            ${r.notes || ""}
          </p>

          ${r.tags && r.tags.length
          ? `<div class="record-card__tags">
                  ${r.tags
            .map(
              (tag) =>
                `<span class="tag-pill">${tag}</span>`
            )
            .join("")}
                </div>`
          : ""
        }
        </div>
      `;

      // fallback cover if image is missing / broken
      const img = el.querySelector("img");
      if (img) {
        img.addEventListener("error", () => {
          img.src = "images/placeholder-cover.png";
        });
      }

      return el;
    }

    function getFilteredAndSortedRecords() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      const fmt = formatSelect?.value || "";
      const sort = sortSelect?.value || "artist";

      let list = records.filter((r) => {
        if (fmt && r.format !== fmt) return false;

        if (q) {
          const haystack = [
            r.title,
            r.artist,
            r.label,
            r.tags ? r.tags.join(" ") : "",
            r.notes || ""
          ]
            .join(" ")
            .toLowerCase();

          if (!haystack.includes(q)) return false;
        }

        return true;
      });

      if (sort === "artist") {
        list.sort((a, b) => a.artist.localeCompare(b.artist));
      } else if (sort === "year") {
        list.sort((a, b) => (a.year || 0) - (b.year || 0));
      } else if (sort === "label") {
        list.sort((a, b) => (a.label || "").localeCompare(b.label || ""));
      } else if (sort === "added") {
        list.sort((a, b) => a.addedIndex - b.addedIndex);
      } else if (sort === "title") {
        list.sort((a, b) => a.title.localeCompare(b.title));
      }


      return list;
    }

    function renderCollection(list) {
      grid.innerHTML = "";
      list.forEach((r) => {
        grid.appendChild(createRecordCard(r));
      });
    }

    function updateCollectionView() {
      renderCollection(getFilteredAndSortedRecords());
    }

    // wire up controls
    searchInput?.addEventListener("input", updateCollectionView);
    formatSelect?.addEventListener("change", updateCollectionView);
    sortSelect?.addEventListener("change", updateCollectionView);

    // initial render
    renderCollection(records);
  }

  /* ========================================================================
     ALBUM PAGE: lightbox / darkroom
     ======================================================================== */

  function setupAlbumLightbox() {
    const galleryRoot = document.querySelector(".album-gallery");
    const thumbs = galleryRoot
      ? galleryRoot.querySelectorAll(".js-album-thumb")
      : [];

    if (!thumbs.length) return;

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

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        openAt((activeIndex + 1) % thumbArray.length);
      } else if (e.key === "ArrowLeft") {
        openAt((activeIndex - 1 + thumbArray.length) % thumbArray.length);
      }
    });
  }
});
