const btermal = document.querySelector('#btermal');
const bgraphics = document.querySelector('#bgraphics');
const btypes = document.querySelector('#btypes');

const types = document.querySelector('#types');
const heatmap = document.querySelector('#heatmap');
const graphics = document.querySelector('#charts');

btypes.addEventListener('click', () => {
  types.classList.remove('hidden')
  heatmap.classList.remove('show');
  graphics.classList.remove('show');
})

btermal.addEventListener('click', () => {
    types.classList.add('hidden')
    heatmap.classList.add('show');
    graphics.classList.remove('show');
});

bgraphics.addEventListener('click', () => {
  types.classList.add('hidden')
  heatmap.classList.remove('show');
  graphics.classList.add('show');
});