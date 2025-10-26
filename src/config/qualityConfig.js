/**
 * Quality Configuration System
 * Adaptive quality tiers based on device capabilities and performance
 * Ensures smooth 30+ FPS on all devices with appropriate visual fidelity
 */

// Quality tier definitions
export const QUALITY_TIERS = {
  ULTRA: {
    name: 'ULTRA',
    noiseLayerCount: 15,
    particleCount: 800,
    tvParticleCount: 200,
    enableTVNoise: true,
    dprRange: [0.6, 0.9],
    description: 'Desktop with powerful GPU'
  },
  HIGH: {
    name: 'HIGH',
    noiseLayerCount: 12,
    particleCount: 600,
    tvParticleCount: 150,
    enableTVNoise: true,
    dprRange: [0.5, 0.8],
    description: 'Desktop or high-end mobile'
  },
  MEDIUM: {
    name: 'MEDIUM',
    noiseLayerCount: 8,
    particleCount: 400,
    tvParticleCount: 0,
    enableTVNoise: false,
    dprRange: [0.4, 0.6],
    description: 'Mobile or mid-range device'
  },
  LOW: {
    name: 'LOW',
    noiseLayerCount: 5,
    particleCount: 200,
    tvParticleCount: 0,
    enableTVNoise: false,
    dprRange: [0.3, 0.5],
    description: 'Budget mobile device'
  }
};

/**
 * Detect device capabilities and determine quality tier
 * Uses multiple heuristics: CPU cores, memory, screen resolution, viewport size
 */
export function detectDeviceTier() {
  if (typeof window === 'undefined') return 'HIGH';

  // Check if mobile/tablet
  const isMobile = window.innerWidth < 1024;
  const isTablet = window.innerWidth < 1920 && window.innerWidth >= 768;

  // Get device memory (Chrome only, fallback to estimating)
  const deviceMemory = navigator.deviceMemory || 4;

  // Get CPU cores (Chrome/Edge only, fallback)
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  // Get viewport dimensions
  const viewportPixels = window.innerWidth * window.innerHeight;

  // Heuristic scoring system
  let score = 0;

  // Memory score (higher memory = better)
  if (deviceMemory >= 8) score += 3;
  else if (deviceMemory >= 4) score += 2;
  else if (deviceMemory >= 2) score += 1;

  // CPU cores score
  if (hardwareConcurrency >= 6) score += 3;
  else if (hardwareConcurrency >= 4) score += 2;
  else if (hardwareConcurrency >= 2) score += 1;

  // Screen resolution score
  if (viewportPixels > 2073600) score += 3; // 1920x1080+
  else if (viewportPixels > 1048576) score += 2; // 1024x1024+
  else if (viewportPixels > 262144) score += 1; // 512x512+

  // Device type score
  if (!isMobile) score += 2; // Desktop penalty reversal
  if (isTablet) score += 1; // Tablet gets slight boost

  // Battery saver mode (if available)
  if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
      if (battery.level < 0.2) score -= 2; // Low battery = reduce quality
    }).catch(() => {});
  }

  // Determine tier based on score
  if (score >= 9) return 'ULTRA';
  if (score >= 6) return 'HIGH';
  if (score >= 3) return 'MEDIUM';
  return 'LOW';
}

/**
 * Get quality config for current device
 * Caches result to avoid recalculation
 */
let cachedTier = null;

export function getQualityConfig() {
  if (!cachedTier) {
    cachedTier = detectDeviceTier();
  }
  return QUALITY_TIERS[cachedTier];
}

/**
 * Force quality tier (for debugging/user preference)
 */
export function forceQualityTier(tier) {
  if (QUALITY_TIERS[tier]) {
    cachedTier = tier;
    console.log(`[Quality] Forced tier: ${tier}`);
    return QUALITY_TIERS[tier];
  }
  console.warn(`[Quality] Invalid tier: ${tier}`);
  return getQualityConfig();
}

/**
 * Get quality tier name for logging
 */
export function getQualityTierName() {
  if (!cachedTier) {
    cachedTier = detectDeviceTier();
  }
  return cachedTier;
}

/**
 * Debug info for current device and selected tier
 */
export function getDebugInfo() {
  if (typeof window === 'undefined') return null;

  const config = getQualityConfig();
  const tierName = getQualityTierName();

  return {
    tier: tierName,
    config: config,
    device: {
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      isMobile: window.innerWidth < 1024,
      isTablet: window.innerWidth < 1920 && window.innerWidth >= 768,
    },
    timestamp: new Date().toISOString()
  };
}
