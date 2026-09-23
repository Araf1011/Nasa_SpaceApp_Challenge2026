/**
 * NASA Deep Space Network (DSN) Live Link Simulator
 * Demonstrates light-speed delay, ground station tracking, and radio telemetry links.
 */

import { formatNumberWithCommas, calculateCurrentTelemetry } from '../utils/orbitalMath.js';
import { soundFX } from './AudioEffects.js';

export class DSNLiveTracker {
  constructor(containerElement, relics) {
    this.container = containerElement;
    this.relics = relics;
    this.selectedRelicId = 'voyager-1';
    this.isPinging = false;
    this.render();
    this.initEventListeners();
  }

  setRelic(relicId) {
    this.selectedRelicId = relicId;
    this.updateDisplay();
  }

  getRelic() {
    return this.relics.find(r => r.id === this.selectedRelicId) || this.relics[0];
  }

  pingProbe() {
    if (this.isPinging) return;
    this.isPinging = true;
    soundFX.playLaserPulse();

    const relic = this.getRelic();
    const pingBtn = this.container.querySelector('#dsn-ping-btn');
    const pingStatus = this.container.querySelector('#dsn-ping-status');
    const pingBar = this.container.querySelector('#dsn-ping-progress-bar');

    if (pingBtn) pingBtn.disabled = true;
    if (pingStatus) {
      pingStatus.textContent = `Uplink beam transmitting at speed of light (${relic.oneWayLightSeconds > 60 ? 'Scaled simulation' : 'Real-time'})...`;
    }

    // Animation progress (scaled to 3 seconds for UI feedback)
    let progress = 0;
    const durationMs = 3000;
    const intervalMs = 30;
    const step = (intervalMs / durationMs) * 100;

    const animInterval = setInterval(() => {
      progress += step;
      if (progress >= 100) {
        progress = 100;
        clearInterval(animInterval);
        soundFX.playRadioCarrier();
        if (pingStatus) {
          pingStatus.textContent = `Downlink Carrier Acquired! One-Way Delay: ${relic.oneWayLightSeconds.toFixed(1)}s (Round-trip: ${(relic.oneWayLightSeconds * 2).toFixed(1)}s)`;
        }
        if (pingBtn) pingBtn.disabled = false;
        this.isPinging = false;
      }
      if (pingBar) pingBar.style.width = `${progress}%`;
    }, intervalMs);
  }

  updateDisplay() {
    const relic = this.getRelic();
    const telemetry = calculateCurrentTelemetry(relic, 0);

    const titleElem = this.container.querySelector('#dsn-target-name');
    const distElem = this.container.querySelector('#dsn-target-dist');
    const delayElem = this.container.querySelector('#dsn-target-delay');
    const freqElem = this.container.querySelector('#dsn-target-freq');
    const stationElem = this.container.querySelector('#dsn-station-name');

    if (titleElem) titleElem.textContent = relic.name;
    if (distElem) distElem.textContent = `${formatNumberWithCommas(Math.round(telemetry.distanceKm))} km (${telemetry.distanceAU.toFixed(2)} AU)`;
    if (delayElem) delayElem.textContent = telemetry.lightTimeString;

    // Appropriate frequency band based on era
    let band = 'X-Band (8.4 GHz) / S-Band';
    let station = 'DSS-14 (70m Dish) - Goldstone, California';
    if (relic.category === 'mars') {
      band = 'X-Band & Ka-Band (32 GHz)';
      station = 'DSS-63 (70m Dish) - Madrid, Spain';
    } else if (relic.id === 'voyager-2') {
      band = 'S-Band / X-Band (160 bps)';
      station = 'DSS-43 (70m Dish) - Canberra, Australia';
    } else if (relic.category === 'moon') {
      band = 'Lunar Laser Optical Ranging (532 nm Green Laser)';
      station = 'Apache Point Lunar Observatory';
    }

    if (freqElem) freqElem.textContent = band;
    if (stationElem) stationElem.textContent = station;
  }

  render() {
    const relic = this.getRelic();
    const telemetry = calculateCurrentTelemetry(relic, 0);

    this.container.innerHTML = `
      <div class="dsn-tracker-panel">
        <div class="dsn-header">
          <div class="dsn-title-group">
            <span class="dsn-live-dot"></span>
            <span class="dsn-title">NASA DEEP SPACE NETWORK (DSN) LINK</span>
          </div>
          <select id="dsn-relic-select" class="dsn-select" aria-label="Select Target Hardware">
            ${this.relics.map(r => `
              <option value="${r.id}" ${r.id === this.selectedRelicId ? 'selected' : ''}>
                ${r.name} (${r.domainLabel})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="dsn-grid">
          <div class="dsn-metric">
            <span class="dsn-label">CURRENT TRACKING TARGET</span>
            <span class="dsn-value text-accent" id="dsn-target-name">${relic.name}</span>
          </div>
          <div class="dsn-metric">
            <span class="dsn-label">ESTIMATED RANGE FROM EARTH</span>
            <span class="dsn-value" id="dsn-target-dist">${formatNumberWithCommas(Math.round(telemetry.distanceKm))} km (${telemetry.distanceAU.toFixed(2)} AU)</span>
          </div>
          <div class="dsn-metric">
            <span class="dsn-label">ONE-WAY LIGHT PROPAGATION</span>
            <span class="dsn-value pulse-text" id="dsn-target-delay">${telemetry.lightTimeString}</span>
          </div>
          <div class="dsn-metric">
            <span class="dsn-label">ACTIVE GROUND STATION</span>
            <span class="dsn-value" id="dsn-station-name">DSS-14 (70m Dish) - Goldstone, California</span>
          </div>
          <div class="dsn-metric full-width">
            <span class="dsn-label">CARRIER FREQUENCY & PROTOCOL</span>
            <span class="dsn-value" id="dsn-target-freq">X-Band (8.4 GHz) / S-Band (2.3 GHz)</span>
          </div>
        </div>

        <!-- Ping Interactive Tool -->
        <div class="dsn-ping-box">
          <div class="dsn-ping-row">
            <button class="dsn-btn" id="dsn-ping-btn">
              📡 <span>Transmit Radio Ping</span>
            </button>
            <span class="dsn-ping-status" id="dsn-ping-status">Ready to transmit carrier wave signal to spacecraft...</span>
          </div>
          <div class="dsn-progress-track">
            <div class="dsn-progress-fill" id="dsn-ping-progress-bar" style="width: 0%;"></div>
          </div>
        </div>
      </div>
    `;
  }

  initEventListeners() {
    const selectElem = this.container.querySelector('#dsn-relic-select');
    selectElem.addEventListener('change', (e) => {
      soundFX.playClick();
      this.setRelic(e.target.value);
    });

    const pingBtn = this.container.querySelector('#dsn-ping-btn');
    pingBtn.addEventListener('click', () => this.pingProbe());
  }
}
