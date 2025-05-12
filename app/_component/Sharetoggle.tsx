import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

interface ShareToggleProps {
  folderId: string | null
}

export default function ShareToggle({ folderId}: ShareToggleProps) {
  const [shared, setShared] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(()=>{
    async function getShared() {
      const response = await axios.get(`/api/shared/?folderId=${folderId}`)

      setShared(response.data.shared)
    }
    getShared()
  },[])

  const handleToggle = async () => {
    const newValue = !shared;
    setShared(newValue); // Optimistic update
    setLoading(true);

    try {
      const res = await fetch(`/api/codesnippet/?folderId=${folderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shared: newValue }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data: { shared: boolean } = await res.json();
      console.log("Updated shared:", data.shared);
    } catch (err) {
      console.error(err);
      setShared(!newValue); // Rollback
    } finally {
      setLoading(false);
    }
  };
  return (
    <label className="inline-flex items-center cursor-pointer justify-end w-full mb-6">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={shared}
        onChange={handleToggle}
        disabled={loading}
      />
      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black dark:peer-checked:bg-blue-600"></div>
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {loading ? "Updating..." : "Share Now"}
      </span>
    </label>
  );
}
