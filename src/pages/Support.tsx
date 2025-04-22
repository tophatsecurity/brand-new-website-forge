
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type SupportDoc = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
};

const Support = () => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<SupportDoc[]>([]);
  const [docs, setDocs] = useState<SupportDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  useEffect(() => {
    setFiltered(
      docs.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.content.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    );
  }, [query, docs]);

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("support_documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setDocs(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Support Center</h1>
          <div className="mb-6 p-4 rounded-lg bg-card shadow">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles..."
              className="mb-2 w-full"
              startAdornment={<Search className="mr-2" />}
            />
            <div className="text-sm text-muted-foreground">Search documentation or articles by keyword, tag, or content.</div>
          </div>
          {loading ? (
            <div className="text-center py-12">Loading articles...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.length === 0 && (
                <div className="text-center pt-12 col-span-2">No articles found.</div>
              )}
              {filtered.map((doc) => (
                <Card key={doc.id} className="mb-2 p-5">
                  <div className="flex items-center mb-2 gap-2">
                    <Badge variant="outline">{doc.category}</Badge>
                    {doc.tags?.map((tag) => (
                      <Badge key={tag} className="ml-2" variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{doc.title}</h2>
                  <div className="line-clamp-3 mb-2">{doc.content.slice(0, 220)}{doc.content.length > 220 && "..."}</div>
                  <div className="text-xs text-muted-foreground">
                    Last updated: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ""}
                  </div>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-12 rounded-lg bg-card p-7 shadow border max-w-2xl mx-auto flex flex-col items-center">
            <div className="mb-2 font-bold text-lg">Need deeper help?</div>
            <div className="text-sm text-muted-foreground mb-4 text-center">
              Live chat is coming soon. For now, contact our support or open a ticket via email.
            </div>
            <Button variant="outline" asChild>
              <a href="mailto:support@tophatsecurity.com">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
