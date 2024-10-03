"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { formatSize } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getGroupsByMentor } from "@/actions/getGroupsByMentor";
import { getDocumentTypes } from "@/actions/getDocumentTypes";
import { FileItem, Group, TypeDocument } from "@/types/global.types";

export default function FileUploadPage() {
  const [fileItem, setFileItem] = useState<FileItem | null>(null);
  const [documentTypes, setDocumentTypes] = useState<TypeDocument[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]); // Guardar los grupos del asesor
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const [openDialog, setOpenDialog] = useState(false);

  const { data: session, status } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileItem({
        file,
        progress: 0,
      });
    }
  };

  useEffect(() => {
    async function fetchGroups() {
      if (session?.user?.roleId === 3 && session.user.email) {
        try {
          const groupsData = await getGroupsByMentor(session.user.email); // Pasar el email del mentor
          setGroups(groupsData);
        } catch (error) {
          console.error("Error al obtener los grupos del asesor:", error);
        }
      }
    }
    fetchGroups();
  }, [session]);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const types = await getDocumentTypes();
        setDocumentTypes(types);
      } catch (error) {
        console.error("Error al obtener los tipos de documentos:", error);
      }
    };
    fetchDocumentTypes();
  }, []);

  const removeFile = () => {
    setFileItem(null);
  };

  const uploadFile = async (replace = false) => {
    if (!selectedDocumentType) {
      toast({
        title: "Error",
        description: "Por favor selecciona un tipo de documento.",
        variant: "destructive",
      });
      return;
    }

    if (session?.user?.roleId === 3 && !selectedGroup) {
      toast({
        title: "Error",
        description: "Por favor seleccione un grupo.",
        variant: "destructive",
      });
      return;
    }

    if (!fileItem) {
      toast({
        title: "Error",
        description: "No hay archivo seleccionado para subir.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();

    formData.append("file", fileItem.file);
    formData.append("documentType", selectedDocumentType);
    formData.append("email", session?.user.email || "");

    if (selectedGroup) {
      formData.append("groupId", selectedGroup);
    }

    if (replace) formData.append("replace", "true");

    try {
      const response = await fetch("/api/document", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.status === 409 && result.replace) {
        setOpenDialog(true); // Abrir el diálogo cuando el archivo ya existe
        return;
      }

      if (response.ok) {
        toast({
          title: "¡Éxito!",
          description: "Archivo subido exitosamente",
        });

        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setFileItem((prevFileItem) => {
            if (prevFileItem) {
              return {
                ...prevFileItem,
                progress,
              };
            }
            return prevFileItem;
          });
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Error al subir el archivo",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al intentar subir el archivo.",
        variant: "destructive",
      });
    }
  };

  const confirmReplace = async () => {
    setOpenDialog(false);
    await uploadFile(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Subida de archivos</h1>
      <div>
        <label className="mb-2 text-lg">Selecciona un tipo de documento</label>
        <Select
          onValueChange={(value) => setSelectedDocumentType(value)}
          value={selectedDocumentType}
        >
          <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
            <SelectValue placeholder="Selecciona un tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipos de documentos</SelectLabel>
              {documentTypes.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {session?.user?.roleId === 3 && (
          <div>
            <label className="mb-2 text-lg">Selecciona un grupo</label>
            <Select
              onValueChange={(value) => setSelectedGroup(value)}
              value={selectedGroup}
            >
              <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
                <SelectValue placeholder="Selecciona un grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mis grupos</SelectLabel>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={String(group.id)}>
                      {group.name} - {group.subject} ({group.semester})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="border p-6 rounded-lg w-full max-w-xl flex justify-center mb-4">
          <label htmlFor="file-upload" className="cursor-pointer px-4 py-2">
            Subir archivo
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

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

        <Button onClick={() => uploadFile()} className="mt-4">
          Cargar documento
        </Button>

        <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Reemplazar archivo?</AlertDialogTitle>
              <AlertDialogDescription>
                El archivo ya existe. Esta acción reemplazará el archivo
                existente con el nuevo archivo subido.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmReplace}>
                Reemplazar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
