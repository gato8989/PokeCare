const express = require('express');
const client = require('prom-client');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

const clsGauge = new client.Gauge({ name: 'web_vitals_cls', help: 'Cumulative Layout Shift' });
const fidGauge = new client.Gauge({ name: 'web_vitals_fid', help: 'First Input Delay (ms)' });
const lcpGauge = new client.Gauge({ name: 'web_vitals_lcp', help: 'Largest Contentful Paint (ms)' });
const fcpGauge = new client.Gauge({ name: 'web_vitals_fcp', help: 'First Contentful Paint (ms)' });
const ttfbGauge = new client.Gauge({ name: 'web_vitals_ttfb', help: 'Time To First Byte (ms)' });

registry.registerMetric(clsGauge);
registry.registerMetric(fidGauge);
registry.registerMetric(lcpGauge);
registry.registerMetric(fcpGauge);
registry.registerMetric(ttfbGauge);


const metricMap = {
  CLS: clsGauge,
  FID: fidGauge,
  LCP: lcpGauge,
  FCP: fcpGauge,
  TTFB: ttfbGauge,
};

app.post('/metrics/report', (req, res) => {
  const { name, value } = req.body;
  const gauge = metricMap[name];
  if (gauge) {
    gauge.set(value);
    console.log(`Updated ${name} → ${value}`);
  }
  res.sendStatus(200);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

app.listen(4000, () => {
  console.log('Metrics server running on http://localhost:4000');
});