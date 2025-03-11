"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X } from "lucide-react"; // Icons for open/close
import { useSession } from "next-auth/react";

interface Folder {
  _id: string;
  name: string;
}



export default function Sidebar() {

  const [isOpen, setIsOpen] = useState(false);

  const {  status } = useSession();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderName, setFolderName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = () => {
    if (status === "authenticated") {
      axios.get("/api/codesnippet").then((res) => setFolders(res.data.folders));
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName) return;
    await axios.post("/api/codesnippet", { name: folderName });
    setFolderName("");
    setOpen(false);
    fetchFolders();
  };

  return (
    // <div className="w-1/4 bg-gray-100 p-4 border-r h-screen fixed left-0">
    //   <h2 className="text-lg font-bold mb-4">Folders</h2>

    //   {/* Folder List */}
    //   {folders.map((folder) => (
    //     <div
    //       key={folder._id}
    //       className="cursor-pointer p-2 rounded-md mb-2 bg-gray-200 hover:bg-blue-500 hover:text-white transition"
    //       onClick={() => router.push(`/codesnippet/${folder._id}`)}
    //     >
    //       {folder.name}
    //     </div>
    //   ))}

    //   {/* Add Folder Button */}
    //   <Dialog open={open} onOpenChange={setOpen}>
    //     <DialogTrigger asChild>
    //       <Button className="mt-4 w-full">+ Add Folder</Button>
    //     </DialogTrigger>
    //     <DialogContent className="p-6">
    //       <DialogTitle>Add a New Folder</DialogTitle>
    //       <Input
    //         placeholder="Enter folder name"
    //         value={folderName}
    //         onChange={(e) => setFolderName(e.target.value)}
    //         className="mt-2"
    //       />
    //       <Button className="mt-4 w-full" onClick={handleCreateFolder}>
    //         Create Folder
    //       </Button>
    //     </DialogContent>
    //   </Dialog>
    // </div>
    <div className="flex">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block w-1/4 bg-gray-100 p-4 border-r h-screen fixed left-0">
        <h2 className="text-lg font-bold mb-4">Folders</h2>

        {/* Folder List */}
        {folders.map((folder) => (
          <div
            key={folder._id}
            className="cursor-pointer p-2 rounded-md mb-2 bg-gray-200 hover:bg-blue-500 hover:text-white transition"
            onClick={() => router.push(`/codesnippet/${folder._id}`)}
          >
            {folder.name}
          </div>
        ))}

        {/* Add Folder Button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full">+ Add Folder</Button>
          </DialogTrigger>
          <DialogContent className="p-6">
            <DialogTitle>Add a New Folder</DialogTitle>
            <Input
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="mt-2"
            />
            <Button className="mt-4 w-full" onClick={handleCreateFolder}>
              Create Folder
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Button to open sidebar (only on mobile) */}
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 text-gray-900 md:hidden ml-3 mt-3   z-50 bg-gray-200 rounded-md"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar Overlay (Closes sidebar when clicked) */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 w-64 h-full bg-gray-100 p-4 border-r z-50 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 md:relative md:translate-x-0 md:w-64`}
        >
          {/* Close button (only on mobile) */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-900 md:hidden"
          >
            <X size={24} />
          </button>

          <h2 className="text-lg font-bold mb-4">Folders</h2>

          {/* Folder List */}
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="cursor-pointer p-2 rounded-md mb-2 bg-gray-200 hover:bg-blue-500 hover:text-white transition"
              onClick={() => router.push(`/codesnippet/${folder._id}`)}
            >
              {folder.name}
            </div>
          ))}

          {/* Add Folder Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 w-full">+ Add Folder</Button>
            </DialogTrigger>
            <DialogContent className="p-6">
              <DialogTitle>Add a New Folder</DialogTitle>
              <Input
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="mt-2"
              />
              <Button className="mt-4 w-full" onClick={handleCreateFolder}>
                Create Folder
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>{" "}
    </div>
  );
}
