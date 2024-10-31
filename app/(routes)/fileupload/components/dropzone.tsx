import { FileItem } from "@/types/global.types";

interface FileInputProps {
  handleFileChange: (fileItem: FileItem) => void;
}

export function FileInput({ handleFileChange }: FileInputProps) {
  return (
    <div className="border p-6 rounded-lg w-full max-w-xl flex justify-center mb-4">
      <label htmlFor="file-upload" className="cursor-pointer px-4 py-2">
        Subir archivo
      </label>
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (file) {
            handleFileChange({ file, progress: 0 });
          }
        }}
        className="hidden"
      />
    </div>
  );
}
