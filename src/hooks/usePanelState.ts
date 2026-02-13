'use client';

import { useState, useEffect, useCallback } from 'react';

interface PanelState {
  leftPanel: boolean;
  rightPanel: boolean;
}

interface UsePanelStateOptions {
  storageKey?: string;
  defaultLeftPanel?: boolean;
  defaultRightPanel?: boolean;
  mobileBreakpoint?: number;
}

export function usePanelState(options: UsePanelStateOptions = {}) {
  const {
    storageKey,
    defaultLeftPanel = true,
    defaultRightPanel = true,
    mobileBreakpoint = 768,
  } = options;

  const [panels, setPanels] = useState<PanelState>({
    leftPanel: defaultLeftPanel,
    rightPanel: defaultRightPanel,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < mobileBreakpoint;
      const tablet = width >= mobileBreakpoint && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);

      // Auto-hide panels on mobile
      if (mobile) {
        setPanels({ leftPanel: false, rightPanel: false });
      } else if (tablet) {
        // On tablet, show only one panel by default
        setPanels({ leftPanel: true, rightPanel: false });
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [mobileBreakpoint]);

  // Load from storage
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setPanels(parsed);
        }
      } catch (e) {
        console.warn('Failed to load panel state:', e);
      }
    }
  }, [storageKey]);

  // Save to storage
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(panels));
      } catch (e) {
        console.warn('Failed to save panel state:', e);
      }
    }
  }, [panels, storageKey]);

  const toggleLeftPanel = useCallback(() => {
    setPanels(prev => ({ ...prev, leftPanel: !prev.leftPanel }));
  }, []);

  const toggleRightPanel = useCallback(() => {
    setPanels(prev => ({ ...prev, rightPanel: !prev.rightPanel }));
  }, []);

  const openLeftPanel = useCallback(() => {
    setPanels(prev => ({ ...prev, leftPanel: true }));
  }, []);

  const openRightPanel = useCallback(() => {
    setPanels(prev => ({ ...prev, rightPanel: true }));
  }, []);

  const closeLeftPanel = useCallback(() => {
    setPanels(prev => ({ ...prev, leftPanel: false }));
  }, []);

  const closeRightPanel = useCallback(() => {
    setPanels(prev => ({ ...prev, rightPanel: false }));
  }, []);

  const closeAllPanels = useCallback(() => {
    setPanels({ leftPanel: false, rightPanel: false });
  }, []);

  const openAllPanels = useCallback(() => {
    setPanels({ leftPanel: true, rightPanel: true });
  }, []);

  return {
    // State
    leftPanelOpen: panels.leftPanel,
    rightPanelOpen: panels.rightPanel,
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    
    // Actions
    toggleLeftPanel,
    toggleRightPanel,
    openLeftPanel,
    openRightPanel,
    closeLeftPanel,
    closeRightPanel,
    closeAllPanels,
    openAllPanels,
    
    // Responsive helpers
    anyPanelOpen: panels.leftPanel || panels.rightPanel,
    bothPanelsOpen: panels.leftPanel && panels.rightPanel,
  };
}

export default usePanelState;
