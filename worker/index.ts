// eslint-disable-next-line no-underscore-dangle, no-restricted-globals
const _self = (self as unknown) as ServiceWorkerGlobalScope;

_self.addEventListener('push', event => {
  if (event === null || event.data === null) return;
  const data = JSON.parse(event.data.text() || '{}');
  event.waitUntil(
    _self.registration.showNotification(data.title || data.message || '浪潮', {
      body: data.title ? data.message : '',
      icon: '/images/icons/icon-384x384.png',
      data,
    })
  );
});

_self.addEventListener('notificationclick', event => {
  if (event === null) return;
  event.notification.close();
  const data = JSON.parse(event.notification.data.text() || '{}');
  event.waitUntil(
    _self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i += 1) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        if (data.purpose !== 'new registration') {
          client.navigate(`/${event.notification.data.eventId || ''}`);
        }
        return client.focus();
      }
      return _self.clients.openWindow(`/${event.notification.data.eventId || ''}`);
    })
  );
});

export {};
