import { formatSize } from "@/lib/utils";

interface FileItemDisplayProps {
  fileItem: { file: File; progress: number } | null;
  removeFile: () => void;
}

export function FileItemDisplay({
  fileItem,
  removeFile,
}: FileItemDisplayProps) {
  return (
    <>
      {fileItem && (
        <div className="relative p-4 border rounded-lg space-y-4 w-full max-w-xl">
          <div className="flex justify-between items-center">
            <span>
              {fileItem.file.name} ({formatSize(fileItem.file.size)})
            </span>
            <button onClick={removeFile} className="text-red-500">
              Eliminar
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded mt-2">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${fileItem.progress}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
}
