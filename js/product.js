(() => {
  const root = document.querySelector('.ab');
  if (!root) return;
  const photos = [...root.querySelectorAll('[data-photo]')];
  const mainPhoto = root.querySelector('#ab-photo');
  const arrows = [...root.querySelectorAll('[data-gallery]')];
  const count = root.querySelector('.ab-count');
  let current = 0;
  function select(index) {
    current = Math.min(Math.max(index, 0), photos.length - 1);
    const chosen = photos[current];
    mainPhoto.src = chosen.dataset.photo;
    mainPhoto.alt = 'Allen-Bradley 1606-XLS960E-3 gallery image ' + (current + 1);
    count.textContent = 'Photo ' + (current + 1) + ' of ' + photos.length;
    photos.forEach(photo => photo.setAttribute('aria-pressed', String(photo === chosen)));
    arrows[0].disabled = current === 0;
    arrows[1].disabled = current === photos.length - 1;
    const track = chosen.parentElement;
    const frame = track.getBoundingClientRect(), item = chosen.getBoundingClientRect();
    if (item.left < frame.left) track.scrollLeft += item.left - frame.left;
    if (item.right > frame.right) track.scrollLeft += item.right - frame.right;
  }
  photos.forEach((button, i) => button.addEventListener('click', () => select(i)));
  arrows.forEach(button => button.addEventListener('click', () => select(current + Number(button.dataset.gallery))));
  select(0);

  const quantity = root.querySelector('#ab-qty');
  root.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => {
      const current = Math.max(1, Math.trunc(quantity.valueAsNumber || 1));
      quantity.value = Math.max(1, current + Number(button.dataset.step));
    });
  });
})();

(() => {
  const frame = document.querySelector('.ab-zoom');
  if (!frame) return;
  function point(event) {
    const box = frame.getBoundingClientRect();
    frame.style.setProperty('--zoom-x', Math.max(0, Math.min(100, (event.clientX-box.left)/box.width*100)) + '%');
    frame.style.setProperty('--zoom-y', Math.max(0, Math.min(100, (event.clientY-box.top)/box.height*100)) + '%');
  }
  frame.addEventListener('pointermove', point);
  frame.addEventListener('click', event => { point(event); frame.classList.toggle('is-zoomed'); });
  frame.addEventListener('keydown', event => {
    if (event.key === 'Escape') frame.classList.remove('is-zoomed');
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); frame.classList.toggle('is-zoomed');
    }
  });
  document.querySelectorAll('[data-photo],[data-gallery]').forEach(button =>
    button.addEventListener('click', () => frame.classList.remove('is-zoomed')));
})();
