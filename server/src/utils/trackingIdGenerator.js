const crypto = require('crypto');

/**
 * TRACKING ID GENERATOR - CORE ANONYMITY COMPONENT
 * 
 * Purpose: Generate unique, cryptographically secure tracking IDs for complaints
 * Security Features:
 * 1. Uses crypto.randomBytes for cryptographic randomness
 * 2. 12-character alphanumeric format (62^12 = ~3.2 quadrillion combinations)
 * 3. URL-safe characters only
 * 4. No sequential patterns (prevents enumeration attacks)
 * 
 * Format: Example - "aB3xK9mN2pQ7"
 * 
 * Why this matters for anonymity:
 * - Tracking IDs cannot be guessed or enumerated
 * - No correlation to userId or timestamp
 * - Students can safely share their tracking ID without revealing identity
 */

const TRACKING_ID_LENGTH = 12;
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a cryptographically secure random tracking ID
 * @returns {string} - 12-character alphanumeric tracking ID
 */
function generateTrackingId() {
    let trackingId = '';

    // Generate random bytes
    const randomBytes = crypto.randomBytes(TRACKING_ID_LENGTH);

    // Convert to alphanumeric characters
    for (let i = 0; i < TRACKING_ID_LENGTH; i++) {
        const randomIndex = randomBytes[i] % CHARSET.length;
        trackingId += CHARSET[randomIndex];
    }

    return trackingId;
}

/**
 * Generate a unique tracking ID with collision detection
 * @param {Function} checkExistence - Async function to check if ID exists in database
 * @returns {Promise<string>} - Guaranteed unique tracking ID
 */
async function generateUniqueTrackingId(checkExistence) {
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    while (attempts < MAX_ATTEMPTS) {
        const trackingId = generateTrackingId();

        // Check if this ID already exists
        const exists = await checkExistence(trackingId);

        if (!exists) {
            return trackingId;
        }

        attempts++;
    }

    // If we couldn't generate unique ID after MAX_ATTEMPTS, throw error
    throw new Error('Failed to generate unique tracking ID after multiple attempts');
}

/**
 * Validate tracking ID format
 * @param {string} trackingId - Tracking ID to validate
 * @returns {boolean} - True if valid format
 */
function isValidTrackingId(trackingId) {
    if (!trackingId || typeof trackingId !== 'string') {
        return false;
    }

    // Check length
    if (trackingId.length !== TRACKING_ID_LENGTH) {
        return false;
    }

    // Check if all characters are alphanumeric
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(trackingId);
}

module.exports = {
    generateTrackingId,
    generateUniqueTrackingId,
    isValidTrackingId,
    TRACKING_ID_LENGTH
};
