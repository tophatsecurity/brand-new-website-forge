import { supabase } from "@/integrations/supabase/client";

export const useDownloadTracking = () => {
  const trackDownload = async (downloadId: string, fileUrl: string) => {
    try {
      // Track the download
      await supabase.functions.invoke('track-download', {
        body: { download_id: downloadId }
      });
    } catch (error) {
      // Don't block the download if tracking fails
      console.error('Failed to track download:', error);
    }

    // Open the file URL
    window.open(fileUrl, '_blank');
  };

  return { trackDownload };
};
