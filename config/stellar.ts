// Stellar API configuration
export const STELLAR_CONFIG = {
  // Primary Stellar API endpoint - same as regular but with stellar token
  API_ENDPOINT: 'https://aiproxy.rozo.ai/rozo/api/v1/chat/completions',

  // Fallback endpoints when primary is not available
  FALLBACK_ENDPOINTS: [],

  // Whether to attempt fallback to regular API with stellar token
  ENABLE_FALLBACK: false,

  // Timeout for stellar API requests (ms)
  REQUEST_TIMEOUT: 30000,
};

export function getStellarToken(): string | null {
  // Check URL params first
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('stellar');

  if (urlToken) {
    // Store in session for later use
    sessionStorage.setItem('stellarToken', urlToken);
    return urlToken;
  }

  // Check session storage as fallback
  return sessionStorage.getItem('stellarToken');
}

export function clearStellarToken(): void {
  sessionStorage.removeItem('stellarToken');
}

export function isUsingStellar(): boolean {
  return getStellarToken() !== null;
}