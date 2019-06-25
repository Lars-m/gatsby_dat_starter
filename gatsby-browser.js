exports.onServiceWorkerUpdateFound = o => {
  console.log("SW", JSON.parse(JSON.stringify(o)));
  
  if ("Notification" in window) {
    if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function(result) {
        console.log("Attempted to get permission for Notifications", result);
      });
    }
  }
};
exports.onServiceWorkerUpdateReady = o => {
  console.log("OnServiceWorkerUpdateFound --> ", o);
  window.location.reload(true);
  if ("Notification" in window) {
    var notification = new Notification("App was updated", {
      body: "Your app has new content"
    });
    setTimeout( notification.close.bind(notification), 3000);
  }
};
