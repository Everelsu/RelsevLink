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

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
      let msg = document.getElementById("copied-message");
      msg.classList.add("show");
      setTimeout(() => {
          msg.classList.remove("show");
      }, 2000);
  });
}


document.querySelectorAll('.btn').forEach(link => {
  link.addEventListener('click', (event) => {
      if (link.href.startsWith('mailto:')) {
          event.preventDefault(); 
          copyText(link.href.replace('mailto:', ''));
      }
  });
});


window.addEventListener('load', createRaindrops);

