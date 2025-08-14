// src/utils/legacyIntegration.js
export const initializeLegacyScripts = () => {
  return new Promise((resolve) => {
    // Load stats-config.js
    if (!window.statsConfig) {
      const configScript = document.createElement('script');
      configScript.src = '/stats-config.js';
      configScript.onload = () => {
        console.log('✅ Stats config loaded');

        // Load stats-api.js
        if (!window.StatsAPI) {
          const apiScript = document.createElement('script');
          apiScript.src = '/stats-api.js';
          apiScript.onload = () => {
            console.log('✅ Stats API loaded');

            // Load table-sorting.js if needed
            const sortScript = document.createElement('script');
            sortScript.src = '/table-sorting.js';
            sortScript.onload = () => {
              console.log('✅ Table sorting loaded');
              resolve();
            };
            document.head.appendChild(sortScript);
          };
          document.head.appendChild(apiScript);
        } else {
          resolve();
        }
      };
      document.head.appendChild(configScript);
    } else {
      resolve();
    }
  });
};

// Add this to your FantasyStatsPage component
useEffect(() => {
  initializeLegacyScripts().then(() => {
    initializeApp();
  });
}, []);