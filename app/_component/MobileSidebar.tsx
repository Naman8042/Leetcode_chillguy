"use client";
import { useState } from "react";
import { Folder } from "./types";
import { useRouter } from "next/navigation";
import {createFolder} from '@/actions/createFolder'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X } from "lucide-react";

export default function MobileSidebar({ folders }: { folders: Folder[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 text-gray-900 md:hidden ml-3 mt-3 z-50 bg-gray-200 rounded-md"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed left-0 top-0 w-64 h-full bg-gray-100 p-4 border-r z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:relative md:translate-x-0 md:w-64`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-900 md:hidden"
        >
          <X size={24} />
        </button>

        <h2 className="text-lg font-bold mb-4">Folders</h2>

        {folders.map((folder) => (
          <div
            key={folder._id}
            className="cursor-pointer p-2 rounded-md mb-2 bg-gray-200 hover:bg-black hover:text-white transition"
            onClick={() => {
              router.push(`/codesnippet/${folder._id}`);
              setIsOpen(false);
            }}
          >
            {folder.name}
          </div>
        ))}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full">+ Add Folder</Button>
          </DialogTrigger>
          <DialogContent className="p-6">
            <DialogTitle>Add a New Folder</DialogTitle>
            <form action={createFolder}>
              <Input
                name="folderName"
                placeholder="Enter folder name"
                className="mt-2"
                required
              />
              <Button type="submit" className="mt-4 w-full">
                Create Folder
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}