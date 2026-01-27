// Carrega fonte de forma assíncrona
(function() {
  const fontLink = document.querySelector('link[media="print"]');
  if (fontLink) fontLink.media = 'all';
})();
