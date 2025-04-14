document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.doc-nav a');
    const sections = document.querySelectorAll('.doc-section');
    const sidebar = document.querySelector('.doc-sidebar');
    
    // Scroll suave
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          // Actualizar clase activa
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          
          // Scroll suave con offset para el header
          const offset = 100;
          const targetPosition = targetSection.offsetTop - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Actualizar URL sin recargar
          history.pushState(null, null, targetId);
        }
      });
    });
    
    // Detectar sección activa al hacer scroll
    function updateActiveSection() {
      const scrollPosition = window.scrollY + 150;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && 
            scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
    
    // Configurar Intersection Observer para mejor performance
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.getAttribute('id');
        const correspondingLink = document.querySelector(`.doc-nav a[href="#${sectionId}"]`);
        
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          correspondingLink?.classList.add('active');
        }
      });
    }, observerOptions);
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    // Activar sección basada en URL al cargar
    const currentHash = window.location.hash;
    if (currentHash) {
      const initialLink = document.querySelector(`.doc-nav a[href="${currentHash}"]`);
      if (initialLink) {
        navLinks.forEach(l => l.classList.remove('active'));
        initialLink.classList.add('active');
        
        // Scroll a la sección después de un pequeño delay
        setTimeout(() => {
          const targetSection = document.querySelector(currentHash);
          if (targetSection) {
            window.scrollTo({
              top: targetSection.offsetTop - 100,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
    
    // Asegurar que el sidebar sea siempre visible
    function updateSidebarPosition() {
      if (window.innerWidth > 768) {
        const scrollPosition = window.scrollY;
        const footer = document.querySelector('.footer');
        const footerPosition = footer.offsetTop;
        const sidebarHeight = sidebar.offsetHeight;
        
        if (scrollPosition + sidebarHeight > footerPosition - 50) {
          sidebar.style.top = `${footerPosition - sidebarHeight - scrollPosition - 50}px`;
        } else {
          sidebar.style.top = '100px';
        }
      }
    }
    
    window.addEventListener('scroll', updateSidebarPosition);
    window.addEventListener('resize', updateSidebarPosition);
  });