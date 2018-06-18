onmessage = function(event) {
  console.log('[MathWorker] Working');
  const result = event.data[0] * 2;
  postMessage(result);
}
