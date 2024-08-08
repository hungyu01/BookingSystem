document.querySelector('.scroll-left').addEventListener('click', () => {
    document.querySelector('.table-wrapper').scrollBy({ left: -200, behavior: 'smooth' });
  });
  
  document.querySelector('.scroll-right').addEventListener('click', () => {
    document.querySelector('.table-wrapper').scrollBy({ left: 200, behavior: 'smooth' });
  });
  