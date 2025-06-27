"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SnippetView from "../../../_component/SnippetView";

export default function FolderPage() {
  const { id } = useParams();
  const [folderId, setFolderId] = useState<string | null>(null);

  useEffect(() => {
    if (id) setFolderId(id as string);
  }, [id]);

  return folderId ? <SnippetView folderId={folderId} /> :<div className="h-dvh"> <p >Loading...</p> </div>;
}
