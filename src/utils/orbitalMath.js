/**
 * Orbital and Telemetry Calculations
 */

export const SPEED_OF_LIGHT_KMS = 299792.458; // km per second
export const ONE_AU_KM = 149597870.7; // 1 Astronomical Unit in km

/**
 * Calculates current real-time distance from Earth based on base distance,
 * relic outbound velocity, and session elapsed time.
 */
export function calculateCurrentTelemetry(relic, elapsedSeconds = 0) {
  const dynamicDistanceKm = relic.baseDistanceKm + (relic.speedKmS * elapsedSeconds);
  const distanceAU = dynamicDistanceKm / ONE_AU_KM;
  const oneWayLightSeconds = dynamicDistanceKm / SPEED_OF_LIGHT_KMS;

  return {
    distanceKm: dynamicDistanceKm,
    distanceAU: distanceAU,
    lightSeconds: oneWayLightSeconds,
    lightTimeString: formatLightTime(oneWayLightSeconds)
  };
}

/**
 * Formats light travel seconds into a human readable string.
 */
export function formatLightTime(seconds) {
  if (seconds < 2) {
    return `${seconds.toFixed(2)} seconds`;
  }
  if (seconds < 60) {
    return `${seconds.toFixed(1)} seconds`;
  }
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const remainderMins = Math.floor((seconds % 3600) / 60);
  const remainderSecs = Math.floor(seconds % 60);
  return `${hours}h ${remainderMins}m ${remainderSecs}s`;
}

/**
 * Formats large numbers with commas.
 */
export function formatNumberWithCommas(num, decimalPlaces = 0) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
}
