/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Centralised static-asset exports.
 *
 * Metro resolves PNG/JPG requires to a bare numeric asset ID that expo-image
 * (and React Native's Image) understand. When the same files are consumed via
 * an ESM `import` statement Metro may wrap them in a module object instead of
 * returning the raw ID, causing images to silently fail on native.
 *
 * Keeping all asset requires here (with the ESLint rule disabled for this
 * file only) lets every other file use normal typed `import` statements.
 */

export const securityImage = require('../../assets/images/security.png') as number;
