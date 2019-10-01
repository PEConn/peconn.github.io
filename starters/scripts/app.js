(function() {
  'use strict';

  const img = document.getElementById('image');
  const configs = [
    { button: 'butBulbasaur', image: 'images/bulbasaur.png', alt: 'Bulbasaur' },
    { button: 'butCharmander', image: 'images/charmander.png', alt: 'Charmander' },
    { button: 'butSquirtle', image: 'images/squirtle.png', alt: 'Squirtle' }
  ];

  configs.forEach((config) => {
    const button = document.getElementById(config.button);
    button.addEventListener('click', function() {
      configs.forEach(otherConfig => {
        if (config === otherConfig) return;
        const otherButton = document.getElementById(otherConfig.button);
        otherButton.classList.remove("mdl-button--colored");
        otherButton.classList.add("mdl-button--accent");
      });
      img.src = config.image;
      img.alt = config.alt;
      button.classList.remove("mdl-button--accent");
      button.classList.add("mdl-button--colored");
    });
  });

  function updateNotificationStatus() {
    const field = document.getElementById('notificationsEnabled');
    field.textContent = Notification.permission;
    setTimeout(updateNotificationStatus, 1000);
  }

  updateNotificationStatus();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function(registration) {
        document.getElementById('butNotify')
            .addEventListener('click', function() {
          const title = 'Your starter';
          const options = {
            body: 'Are you happy with your choice?',
            icon: img.src,
            data: {
              url: window.location.origin + window.location.pathname + "?notification=true"
            }
          };

          if (Notification.permission !== "granted") {
            Notification.requestPermission();
          }

          registration.showNotification(title, options);
        });

        document.getElementById('butCancel')
            .addEventListener('click', function() {
          registration.getNotifications().then(function(notifications) {
            notifications.forEach(notification => notification.close());
          });
        });
      }
      )
      .then(function() { console.log('Service Worker Registered'); });
  }

  if (window.Worker) {
    const output = document.getElementById('response');
    function appendOutput(msg) {
      var log = output.textContent;
      output.textContent = log + msg + "\n";
    }
    const button = document.getElementById('butMessageWorker');
    button.disabled = false;

    var worker = null;

    button.addEventListener('click', function() {
      if (worker == null) {
        worker = new Worker('./math-worker.js');
        worker.onmessage = (event) => appendOutput(event.data);
      }
      worker.postMessage([3]);
    });


    const clientButton = document.getElementById('butMessageClient');
    clientButton.disabled = true;
    window.addEventListener("message", function(event) {
      console.log("[PostMessage] Got MessagePort.");
      var port = event.ports[0];
      port.postMessage("Connected");

      clientButton.disabled = false;
      clientButton.addEventListener('click', function() {
        port.postMessage(img.alt);
      });

      port.onmessage = function(event) {
        console.log("[PostMessage] Got Message: " + event.data);
        appendOutput(event.data);
        port.postMessage("ACK " + event.data);
      };
    });
  }

  const shareButton = document.getElementById('butShare');
  shareButton.disabled = true;
  if (navigator.share) {
    shareButton.disabled = false;
    shareButton.addEventListener('click', function() {
      navigator.share({
        title: 'Your Choice',
        text: 'You picked ' + img.alt,
        url: window.location.href
      }).then(() => console.log("[Share] Success."))
        .catch((error) => console.log("[Share] Error.", error));
    });
  }

  document.getElementById('url').textContent = window.location.href;

  function getCookie(name) {
    var value = null;
    document.cookie.split(';').forEach(cookie => {
      cookie = cookie.trim();
      if (cookie.startsWith(name)) {
        value = cookie.substring(name.length + 1);
      }
    });

    return value;
  }

  function setCookie(name, value) {
    var year = 60*60*25*365;
    // Yes this is ugly...
    var domain = document.location.hostname;
    if (domain === "localhost") {
      document.cookie = `${name}=${value} ;max-age=${year} ;path=/`;
    } else {
      document.cookie = `${name}=${value} ;max-age=${year} ;domain=${domain} ;path=/`;
    }
  }

  var visitCount = Number(getCookie("visitCount"));
  if (isNaN(visitCount)) visitCount = 1;

  document.getElementById('cookie').textContent = visitCount;

  setCookie("visitCount", visitCount + 1);

})();
