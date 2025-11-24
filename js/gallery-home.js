
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.gallery-track');
  if (!track) return;

  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');

  let slides = [];
  let currentIndex = 0;
  let autoTimer = null;

  async function loadGallery() {
    try {
      const res = await fetch('gallery/list.json');
      const data = await res.json();
      const images = (data.images || []).filter(Boolean);

      if (!images.length) return;

      images.forEach((fileName, i) => {
        const slide = document.createElement('a');
        slide.className = 'gallery-slide';
        slide.href = `gallery/event${i + 1}.html`;

        const img = document.createElement('img');
        img.src = `gallery/${fileName}`;
        img.alt = `Featured Event ${i + 1}`;

        const caption = document.createElement('div');
        caption.className = 'gallery-caption';
        caption.textContent = `Featured Event ${i + 1}`;

        slide.appendChild(img);
        slide.appendChild(caption);
        track.appendChild(slide);
      });

      slides = Array.from(document.querySelectorAll('.gallery-slide'));
      updateSlides();
      startAutoPlay();

      prevBtn?.addEventListener('click', () => move(-1));
      nextBtn?.addEventListener('click', () => move(1));

      track.addEventListener('mouseenter', stopAutoPlay);
      track.addEventListener('mouseleave', startAutoPlay);
    } catch (err) {
      console.error('Gallery load failed:', err);
    }
  }

  function move(direction) {
    if (!slides.length) return;
    stopAutoPlay();

    currentIndex = (currentIndex + direction + slides.length) % slides.length;
    updateSlides();
    startAutoPlay();
  }

  function updateSlides() {
    if (!slides.length) return;

    slides.forEach((slide, i) => {
      const offset = (i - currentIndex + slides.length) % slides.length;

      slide.classList.remove('is-center', 'is-side', 'is-hidden');

      if (offset === 0) {
        slide.classList.add('is-center');
      } else if (offset === 1 || offset === slides.length - 1) {
        slide.classList.add('is-side');
      } else {
        slide.classList.add('is-hidden');
      }
    });

    const centerOffset = -currentIndex * 100;
    track.style.transform = `translateX(${centerOffset}%)`;
  }

  function startAutoPlay() {
    if (autoTimer || slides.length <= 1) return;
    autoTimer = setInterval(() => move(1), 6000);
  }

  function stopAutoPlay() {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  }

  loadGallery();
});
