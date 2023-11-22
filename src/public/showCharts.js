const btermal = document.querySelector('#btermal');

const heatmap = document.querySelector('#heatmap');
const graphics = document.querySelector('#charts');

btermal.addEventListener('click', () => {
    heatmap.classList.add('show');
    graphics.classList.add('hidden');
});

const bgraphics = document.querySelector('#bgraphics');
bgraphics.addEventListener('click', () => {
    heatmap.classList.remove('show');
    graphics.classList.remove('hidden');
});