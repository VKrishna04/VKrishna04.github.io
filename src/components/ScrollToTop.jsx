/*
 * Copyright 2025 Krishna GSVV
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
// === LEGACY/BACKUP: Direct icon imports (deprecated) ===
// import { ArrowUpIcon } from "@heroicons/react/24/outline"; // REPLACED with unified icon system
// ========================================================

// === MODULAR SYSTEMS: Use unified icon system ===
import { UnifiedIcon } from "./UnifiedIcon";
// ================================================

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					onClick={scrollToTop}
					className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					aria-label="Scroll to top"
				>
					<UnifiedIcon name="HiArrowUp" className="w-5 h-5" fallback={null} />
				</motion.button>
			)}
		</AnimatePresence>
	);
};

export default ScrollToTop;
