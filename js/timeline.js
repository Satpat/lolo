/* ============================================
   TIMELINE — Rendering + scroll animations
   ============================================ */

function initTimeline() {
  const container = document.getElementById("timelineContainer");
  const events = config.timeline;

  // Build timeline items
  events.forEach((event, index) => {
    const side = index % 2 === 0 ? "left" : "right";
    const item = document.createElement("div");
    item.className = `timeline-item ${side}`;

    let photoHtml = "";
    if (event.photo) {
      photoHtml = `<img src="${event.photo}" alt="${event.title}" class="timeline-photo" loading="lazy">`;
    }

    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-date">${event.date}</div>
        <h3 class="timeline-title">${event.title}</h3>
        <p class="timeline-description">${event.description}</p>
        ${photoHtml}
      </div>
    `;

    container.appendChild(item);
  });

  // Scroll-triggered reveal using Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -80px 0px",
    }
  );

  document.querySelectorAll(".timeline-item").forEach((item) => {
    observer.observe(item);
  });
}
