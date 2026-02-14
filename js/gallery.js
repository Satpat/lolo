/* ============================================
   GALLERY — Photo grid + Lightbox
   ============================================ */

function initGallery() {
  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  let currentIndex = 0;
  const photos = config.photos;

  // Build gallery grid
  photos.forEach((photo, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item";

    if (photo.placeholder || !photo.src) {
      // Placeholder card
      item.innerHTML = `
        <div class="gallery-placeholder">
          <div class="gallery-placeholder-icon">\ud83d\udcf7</div>
          <div class="gallery-placeholder-text">${photo.caption}</div>
        </div>
        <div class="gallery-overlay">
          <p class="gallery-caption">${photo.caption}</p>
        </div>
      `;
    } else {
      // Real photo
      item.innerHTML = `
        <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
        <div class="gallery-overlay">
          <p class="gallery-caption">${photo.caption}</p>
        </div>
      `;
    }

    item.addEventListener("click", () => openLightbox(index));
    grid.appendChild(item);
  });

  // Lightbox controls
  function openLightbox(index) {
    // Don't open lightbox for placeholder images
    if (photos[index].placeholder || !photos[index].src) return;

    currentIndex = index;
    updateLightbox();
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const photo = photos[currentIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.caption;
    lightboxCaption.textContent = photo.caption;
  }

  function nextPhoto() {
    // Skip placeholders when navigating
    let next = (currentIndex + 1) % photos.length;
    let attempts = 0;
    while ((photos[next].placeholder || !photos[next].src) && attempts < photos.length) {
      next = (next + 1) % photos.length;
      attempts++;
    }
    if (attempts < photos.length) {
      currentIndex = next;
      updateLightbox();
    }
  }

  function prevPhoto() {
    let prev = (currentIndex - 1 + photos.length) % photos.length;
    let attempts = 0;
    while ((photos[prev].placeholder || !photos[prev].src) && attempts < photos.length) {
      prev = (prev - 1 + photos.length) % photos.length;
      attempts++;
    }
    if (attempts < photos.length) {
      currentIndex = prev;
      updateLightbox();
    }
  }

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", prevPhoto);
  nextBtn.addEventListener("click", nextPhoto);

  // Click backdrop to close
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextPhoto();
    if (e.key === "ArrowLeft") prevPhoto();
  });
}
