(function() {
  'use strict';

  const img = document.getElementById('image');
  const configs = [
    { button: 'butBulbasaur', image: 'images/bulbasaur.png' },
    { button: 'butCharmander', image: 'images/charmander.png' },
    { button: 'butSquirtle', image: 'images/squirtle.png' }
  ]

  configs.forEach(config => {
    const button = document.getElementById(config.button);
    button.addEventListener('click', function() {
      configs.forEach(otherConfig => {
        if (config === otherConfig) return;
        const otherButton = document.getElementById(otherConfig.button);
        otherButton.classList.remove("mdl-button--colored");
        otherButton.classList.add("mdl-button--accent");
      });
      img.src = config.image;
      button.classList.remove("mdl-button--accent");
      button.classList.add("mdl-button--colored");
    });
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function(registration) {
        document.getElementById('butNotify').addEventListener('click', function() {
          const title = 'Your starter'
          const options = {
            body: 'Are you happy with your choice?',
            icon: img.src,
            badge: img.src
          };
          registration.showNotification(title, options);
        });

        document.getElementById('butCancel').addEventListener('click', function() {
          registration.getNotifications().then(function(notifications) {
            notifications.forEach(notification => notification.close());
          });
        });
      }
      )
      .then(function() { console.log('Service Worker Registered'); });

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }

  if (window.Worker) {
    const button = document.getElementById('butMessage');
    const output = document.getElementById('response');
    button.disabled = false;

    var worker = null;

    button.addEventListener('click', function() {
      if (worker == null) {
        worker = new Worker('./math-worker.js');
        worker.onmessage = (event) => output.textContent = event.data;
      }
      worker.postMessage([3]);
    });
  }

  document.getElementById('url').textContent = window.location.href;

})();
