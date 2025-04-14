class Carousel {
  constructor(element) {
    this.carousel = element;
    this.slides = this.carousel.querySelectorAll('.slide');
    this.dots = this.carousel.querySelectorAll('.dot');
    this.prevBtn = this.carousel.querySelector('.prev');
    this.nextBtn = this.carousel.querySelector('.next');
    this.slidesContainer = this.carousel.querySelector('.slides-container');
    this.currentIndex = 0;
    this.interval = null;
    this.autoPlayDelay = 5000;
    this.touchStartX = 0;
    this.touchEndX = 0;

    // Inicialización
    this.init();
  }

  init() {
    // Detectar si JS está activado
    this.carousel.classList.remove('no-js');
    
    // Event listeners
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Touch events
    this.carousel.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      clearInterval(this.interval);
    }, { passive: true });

    this.carousel.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      this.startAutoPlay();
    }, { passive: true });

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (document.activeElement === this.carousel || this.carousel.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') this.prevSlide();
        if (e.key === 'ArrowRight') this.nextSlide();
      }
    });

    // Iniciar autoplay
    this.startAutoPlay();

    // Pausar al interactuar
    this.carousel.addEventListener('mouseenter', () => clearInterval(this.interval));
    this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  updateCarousel() {
    // Mover slides
    this.slidesContainer.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    
    // Actualizar dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Actualizar ARIA
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== this.currentIndex);
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  handleSwipe() {
    const threshold = 50;
    const difference = this.touchStartX - this.touchEndX;

    if (difference > threshold) {
      this.nextSlide();
    } else if (difference < -threshold) {
      this.prevSlide();
    }
  }

  startAutoPlay() {
    clearInterval(this.interval);
    this.interval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
  }
}

// Inicializar todos los carruseles
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel').forEach(carousel => {
    new Carousel(carousel);
  });
});