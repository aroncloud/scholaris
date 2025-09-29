/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConfigStore } from "@/lib/store/configStore";

export const useInitConfigs = () => {
  const { setConfigs, isLoaded, lastUpdated } = useConfigStore();

  const initConfigs = async (getConfigFn: () => Promise<any>) => {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const isRecent = lastUpdated && (Date.now() - lastUpdated) < oneDayInMs;

    if (isLoaded && isRecent) {
      console.log('Configs already loaded and recent');
      return;
    }

    try {
      const result = await getConfigFn();
      if (result.code === 'success' && result.data) {
        setConfigs(result.data);
        console.log('Config loaded:', result.data);
      }
    } catch (error) {
      console.error('Error loading configs:', error);
    }
  };

  return { initConfigs, isLoaded };
};