import React, { useEffect, useState } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, ChevronDown, ChevronUp } from "lucide-react";
import AddArticleForm from "@/components/support/AddArticleForm";
import { useAuth } from "@/contexts/AuthContext";

type SupportDoc = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  author_name?: string;
};

const Support = () => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<SupportDoc[]>([]);
  const [docs, setDocs] = useState<SupportDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

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

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <UserLayout title="Support Center">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Search help articles and documentation</p>
        {user?.user_metadata?.approved && (
          <Button onClick={toggleForm} variant="outline" className="flex items-center gap-2">
            {showForm ? (
              <>
                <ChevronUp size={16} />
                Hide Form
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Article
              </>
            )}
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Submit a New Support Article</h2>
          <AddArticleForm onSuccess={() => {
            fetchDocs();
            setShowForm(false);
          }} />
        </Card>
      )}

      <div className="mb-6 p-4 rounded-lg bg-card shadow">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-10"
          />
        </div>
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
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div>
                  Last updated: {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ""}
                </div>
                {doc.author_name && (
                  <div className="italic">
                    By: {doc.author_name}
                  </div>
                )}
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
    </UserLayout>
  );
};

export default Support;
