(function() {
  'use strict';
  const configs = [
    { button: 'butBulbasaur', image: 'images/bulbasaur.png' },
    { button: 'butCharmander', image: 'images/charmander.png' },
    { button: 'butSquirtle', image: 'images/squirtle.png' }
  ]

  configs.forEach(config => {
    document.getElementById(config.button).addEventListener('click', function() {
        document.getElementById('image').src = config.image;
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
        worker.onmessage = (event) => response.textContent = event.data;
      }
      worker.postMessage([3]);
    });
  }

})();
