
function createRaindrops() {
  const rainContainer = document.querySelector('.rain');
  const dropCount = 100;

  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDelay = `${Math.random()}s`;
    rainContainer.appendChild(drop);
  }
}



window.addEventListener('load', createRaindrops);

