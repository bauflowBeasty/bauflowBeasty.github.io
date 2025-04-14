document.addEventListener('DOMContentLoaded', () => {
    const techFilter = document.getElementById('tech-filter');
    const sortSelect = document.getElementById('sort');
    const projectGrid = document.querySelector('.projects-grid');
    const projects = Array.from(document.querySelectorAll('.project-card'));
  
    // Filtrado por tecnología
    techFilter.addEventListener('change', () => {
      const selectedTech = techFilter.value;
      
      projects.forEach(project => {
        const matchesTech = selectedTech === 'all' || 
                           project.dataset.tech === selectedTech;
        
        project.style.display = matchesTech ? 'block' : 'none';
      });
    });
  
    // Ordenamiento
    sortSelect.addEventListener('change', () => {
      const sortMethod = sortSelect.value;
      
      projects.sort((a, b) => {
        switch(sortMethod) {
          case 'newest':
            return new Date(b.dataset.date) - new Date(a.dataset.date);
          case 'oldest':
            return new Date(a.dataset.date) - new Date(b.dataset.date);
          case 'name':
            return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
          default:
            return 0;
        }
      });
  
      // Reinsertar proyectos ordenados
      projects.forEach(project => {
        projectGrid.appendChild(project);
      });
    });
  });