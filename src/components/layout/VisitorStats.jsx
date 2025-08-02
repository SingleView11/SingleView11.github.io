import { useState, useEffect } from 'react';
import { Divider } from 'antd';

const VisitorStats = () => {
    // Historical baseline from previous deployment, before migration and changing pv uv calculation way
    const BASELINE_PV = 0;
    const BASELINE_UV = 0;
    
    const [stats, setStats] = useState({
        siteuv: 0,   // Start with 0
        sitepv: 0    // Start with 0
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(true); // Show immediately

    useEffect(() => {
        let loaded = false; // Use local variable instead of state

        // Check if Busuanzi is loaded and update stats
        const updateStats = () => {
            // Wait for both Busuanzi script and DOM elements
            const siteUvElement = document.getElementById('busuanzi_value_site_uv');
            const sitePvElement = document.getElementById('busuanzi_value_site_pv');
            
            // Only log if elements exist and have content
            if (siteUvElement && sitePvElement) {
                const uvText = siteUvElement.textContent;
                const pvText = sitePvElement.textContent;
                
                // Only log when content actually changes from empty
                if (uvText && pvText && (uvText !== '' && pvText !== '')) {
                    console.log('Busuanzi loaded:', { uv: uvText, pv: pvText });
                    
                    const newUv = parseInt(uvText) || -6173;
                    const newPv = parseInt(pvText) || -22947;
                    
                    setStats({
                        siteuv: newUv + 6173,   // UV baseline
                        sitepv: newPv + 22947   // PV baseline
                    });
                    setIsLoaded(true);
                    loaded = true; // Set local variable
                    return true;
                }
            }
            return false;
        };

        // Show the component after a small delay to avoid initial flash
        const showTimer = setTimeout(() => {
            setIsVisible(true);
            // Only set baseline if Busuanzi hasn't loaded yet
            if (!loaded) { // Use local variable
                setStats({
                    siteuv: 6173,   // Just show the baseline first
                    sitepv: 22947   // Just show the baseline first
                });
            }
        }, 500);

        // Initial check
        if (updateStats()) return;

        // Set up interval to check for Busuanzi loading
        const interval = setInterval(() => {
            if (updateStats()) {
                clearInterval(interval);
            }
        }, 100);

        // Cleanup interval after 10 seconds max
        const timeout = setTimeout(() => {
            clearInterval(interval);
            // Don't override if already loaded - this was the bug!
            console.log('Timeout reached, Busuanzi may have failed to load');
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
            clearTimeout(showTimer);
        };
    }, []); // Remove isLoaded dependency to avoid infinite loops
    
    // Don't render until ready to avoid flash
    if (!isVisible) {
        return (
            <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                flexWrap: 'nowrap',
                whiteSpace: 'nowrap'
            }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    👁️ <strong>Loading...</strong>
                    <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
                    👤 <strong>Loading...</strong>
                </span>
            </div>
        );
    }
    
    return (
        <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap'
        }}>
            {/* Hidden Busuanzi elements for data collection - force them to stay hidden */}
            <div style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}>
                <span id="busuanzi_container_site_pv">
                    <span id="busuanzi_value_site_pv"></span>
                </span>
                <span id="busuanzi_container_site_uv">
                    <span id="busuanzi_value_site_uv"></span>
                </span>
            </div>

            {/* Display statistics in one line */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                👁️ <strong>{stats.sitepv.toLocaleString()}</strong>
                <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
                👤 <strong>{stats.siteuv.toLocaleString()}</strong>
                <span style={{ fontSize: '10px', opacity: 0.7, marginLeft: '8px' }}>
                    since launch
                </span>
            </span>
        </div>
    );
};

export default VisitorStats;
