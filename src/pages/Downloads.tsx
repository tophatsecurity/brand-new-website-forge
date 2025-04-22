
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const productTypes = [
  "Virtual Machine",
  "Physical Hardware",
  "Appliance",
  "SEEKCAP",
  "DDX",
  "ParaGuard",
];

const Downloads = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    setLoading(true);
    // Show all downloads to allowed users, sorted by product/type/version
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Downloads</h1>
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
                      <TableHead>Version</TableHead>
                      <TableHead>Released</TableHead>
                      <TableHead>Description</TableHead>
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
                        <TableCell>{dl.version}</TableCell>
                        <TableCell>{dl.release_date ? new Date(dl.release_date).toLocaleDateString() : ""}</TableCell>
                        <TableCell>{dl.description}</TableCell>
                        <TableCell>
                          <a
                            href={dl.file_url}
                            className="underline text-blue-600 hover:text-blue-800"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            Download
                          </a>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Downloads;
