/**
 * LEGACY/BACKUP: Consolidated Icons Utility
 *
 * @deprecated This file is maintained for backward compatibility only.
 *
 * RECOMMENDED: Use the new Unified Icon System instead
 * import { getUnifiedIcon, UnifiedIcon } from './iconSystemCore.js';
 *
 * The Unified Icon System provides:
 * - Access to 50,000+ icons from 40+ libraries
 * - Automatic library detection
 * - Better performance with caching
 * - Simpler API
 *
 * See: docs/Unified Icon System Guide.md
 */

// Redirect to unified system for new implementations
export { getUnifiedIcon, getIconWithFallback } from "./iconSystemCore.js"
export { UnifiedIcon } from "../components/UnifiedIcon.jsx"

// Legacy icon map is no longer available
export const consolidatedIcons = {
	info: "LEGACY_ICON_MAP has been removed. Use UnifiedIcon component instead.",
	migration: "See docs/Unified Icon System Guide.md",
}

// Default export for backward compatibility
export default {
	// Empty placeholder - use unified system instead
	info: 'This module is deprecated. Use unifiedIconSystem instead.',
	migration: 'See docs/Unified Icon System Guide.md for migration guide'
};
