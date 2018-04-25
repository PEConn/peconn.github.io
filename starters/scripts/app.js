// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
  'use strict';
  var img = document.getElementById('image')

  document.getElementById('butBulbasaur').addEventListener('click', function() {
    img.src='images/bulbasaur.png';
  });
  document.getElementById('butCharmander').addEventListener('click', function() {
    img.src='images/charmander.png';
  });
  document.getElementById('butSquirtle').addEventListener('click', function() {
    img.src='images/squirtle.png';
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  document.getElementById('butNotify').addEventListener('click', function() {
    if (Notification.permission !== "granted")
      Notification.requestPermission();
    else {
      var notification = new Notification('Your starter', {
        icon: img.src,
        body: "This is your starter!",
      });

      notification.onclick = function () {
        window.open(window.location.href);
      };

      document.getElementById('butCancel').addEventListener('click', function() {
        notification.close();
      });
    }
  });
})();
