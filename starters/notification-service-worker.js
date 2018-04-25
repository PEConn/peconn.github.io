self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked.');
  event.notification.close();
  event.waitUntil(
    clients.openWindow(window.location.href)
  );
});
