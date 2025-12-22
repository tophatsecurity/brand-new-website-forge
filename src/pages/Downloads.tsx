import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserLayout from "@/components/layouts/UserLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileCheck } from "lucide-react";
import { useDownloadTracking } from "@/hooks/useDownloadTracking";
import { useToast } from "@/hooks/use-toast";

const Downloads = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackDownload } = useDownloadTracking();
  const { toast } = useToast();

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_downloads")
      .select("*")
      .order("product_name")
      .order("product_type")
      .order("release_date", { ascending: false });

    if (!error && data) {
      setDownloads(data);
    }
    setLoading(false);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({ title: "Copied", description: "SHA256 hash copied to clipboard" });
  };

  return (
    <UserLayout title="Downloads">
      <p className="text-muted-foreground mb-6">Access product downloads and documentation</p>
      
      <div className="bg-card rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Product Downloads</h2>
        {loading ? (
          <div className="py-8 text-center">Loading downloads...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Released</TableHead>
                  <TableHead>Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {downloads.map(dl => (
                  <TableRow key={dl.id}>
                    <TableCell>
                      {dl.product_name}{" "}
                      {dl.is_latest && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 ml-2">
                          Latest
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge>{dl.product_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {dl.package_format ? (
                        <Badge variant="outline" className="uppercase text-xs">
                          {dl.package_format}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>{dl.version}</TableCell>
                    <TableCell>
                      {dl.sha256_hash ? (
                        <div className="flex items-center gap-1">
                          <code className="text-xs text-muted-foreground truncate max-w-[80px]" title={dl.sha256_hash}>
                            {dl.sha256_hash.substring(0, 8)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => handleCopyHash(dl.sha256_hash)}
                          >
                            <FileCheck className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>{dl.release_date ? new Date(dl.release_date).toLocaleDateString() : ""}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => trackDownload(dl.id, dl.file_url)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {downloads.length === 0 && (
              <div className="text-center py-8">No downloads available.</div>
            )}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Downloads;
