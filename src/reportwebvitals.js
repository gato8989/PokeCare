import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

function sendToBackend(metric) {
  fetch('http://localhost:4000/metrics/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric),
  }).catch((err) => console.error('Metric send error:', err));
}

export function reportWebVitals() {
  getCLS(sendToBackend);
  getFID(sendToBackend);
  getLCP(sendToBackend);
  getFCP(sendToBackend);
  getTTFB(sendToBackend);
}