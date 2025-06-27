import { useState, useEffect } from "react";
import ShareToggle from "./Sharetoggle";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Snippet {
  _id: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

interface SnippetViewProps {
  folderId: string | null;
}

function SnippetView({ folderId }: SnippetViewProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [newSnippet, setNewSnippet] = useState({
    title: "",
    description: "",
    code: "",
    language: "",
  });

  useEffect(() => {
    if (!folderId) return;

    const fetchSnippets = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/folder?folderId=${folderId}`);
        setSnippets(res.data.snippets);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log("Error fetching snippets:", error);
          toast.error(
            error.response?.data?.error || "Failed to fetch snippets"
          );
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [folderId]);

  const handleAddSnippet = async () => {
    if (
      !folderId ||
      !newSnippet.title ||
      !newSnippet.code ||
      !newSnippet.language
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const res = await axios.post("/api/folder", {
        folderId,
        ...newSnippet,
      });
      setSnippets([...snippets, res.data.newSnippet]);
      setNewSnippet({ title: "", description: "", code: "", language: "" });
      setOpen(false);
    } catch (error) {
      console.error("Error adding snippet:", error);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard");
  };

  return (
    <div className="p-4 w-full max-w-4xl mx-auto overflow-y-auto">
      <ShareToggle folderId={folderId} />

      {/* Add Snippet Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex justify-end">
            <Button className="mb-4">+ Add Snippet</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="p-6">
          <DialogTitle>Add a New Snippet</DialogTitle>
          <Input
            placeholder="Title"
            value={newSnippet.title}
            onChange={(e) =>
              setNewSnippet({ ...newSnippet, title: e.target.value })
            }
            className="mt-2 w-full"
          />
          <Input
            placeholder="Description"
            value={newSnippet.description}
            onChange={(e) =>
              setNewSnippet({ ...newSnippet, description: e.target.value })
            }
            className="mt-2 w-full"
          />
          <Input
            placeholder="Language"
            value={newSnippet.language}
            onChange={(e) =>
              setNewSnippet({ ...newSnippet, language: e.target.value })
            }
            className="mt-2 w-full"
          />
          <textarea
            placeholder="Code"
            className="border p-2 rounded w-full mt-2 resize-none h-40"
            value={newSnippet.code}
            onChange={(e) =>
              setNewSnippet({ ...newSnippet, code: e.target.value })
            }
          ></textarea>
          <Button className="mt-4 w-full" onClick={handleAddSnippet}>
            Add Snippet
          </Button>
        </DialogContent>
      </Dialog>

      {/* Snippets List */}
      {loading ? (
        <p className="text-center">Loading snippets...</p>
      ) : snippets.length > 0 ? (
        snippets.map((snippet) => (
          <div
            key={snippet._id}
            className="p-4 border rounded-md mb-3 relative bg-white shadow-md"
          >
            <h3 className="text-lg font-semibold">{snippet.title}</h3>
            <p className="text-gray-600">{snippet.description}</p>
            <div className="bg-gray-100 p-3 rounded-md overflow-x-auto relative">
              <pre className="whitespace-pre-wrap break-words text-sm">
                <code>{snippet.code}</code>
              </pre>
              <button
                className="absolute top-2 right-2 bg-gray-300 p-1 rounded-md text-xs hover:bg-gray-400"
                onClick={() => handleCopy(snippet.code)}
              >
                Copy
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">
          No snippets available in this folder.
        </p>
      )}
    </div>
  );
}

export default SnippetView;
