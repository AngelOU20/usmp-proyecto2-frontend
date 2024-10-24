"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
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
import { getSubjects } from "@/actions/getSubjects";
import { getSemesters } from "@/actions/getSemesters";
import {
  FileItem,
  Group,
  TypeDocument,
  Subject,
  Semester,
} from "@/types/global.types";
import { Loader2 } from "lucide-react";
import { DocumentTypeSelector } from "./components/document-type-selector";
import { GroupSelector } from "./components/group-selector";
import { SubjectSemesterSelector } from "./components/subject-semester-selector";
import { FileInput } from "./components/dropzone";
import { FileItemDisplay } from "./components/file-item-display";

export default function FileUploadPage() {
  const [fileItem, setFileItem] = useState<FileItem | null>(null);
  const [documentTypes, setDocumentTypes] = useState<TypeDocument[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const handleFileChange = (file: FileItem) => {
    setFileItem(file);
  };

  // Fetch document types
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

  // Fetch groups for mentor
  useEffect(() => {
    async function fetchGroups() {
      if (session?.user?.roleId === 3 && session.user.email) {
        try {
          const groupsData = await getGroupsByMentor(session.user.email);
          setGroups(groupsData);
        } catch (error) {
          console.error("Error al obtener los grupos del asesor:", error);
        }
      }
    }
    fetchGroups();
  }, [session]);

  // Fetch subjects and semesters for authorities
  useEffect(() => {
    if (session?.user?.roleId === 4) {
      const fetchSubjectsAndSemesters = async () => {
        try {
          const subjectsData = await getSubjects();
          const semestersData = await getSemesters();
          setSubjects(subjectsData);
          setSemesters(semestersData);
        } catch (error) {
          console.error("Error al obtener asignaturas o semestres:", error);
        }
      };
      fetchSubjectsAndSemesters();
    }
  }, [session]);

  const removeFile = () => {
    setFileItem(null);
  };

  // Función para subir el archivo
  const uploadFile = async (replace = false) => {
    setIsLoading(true);

    if (!selectedDocumentType) {
      toast({
        title: "Error",
        description: "Por favor selecciona un tipo de documento.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (session?.user?.roleId === 3 && !selectedGroup) {
      toast({
        title: "Error",
        description: "Por favor seleccione un grupo.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!fileItem) {
      toast({
        title: "Error",
        description: "No hay archivo seleccionado para subir.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();

    formData.append("file", fileItem.file);
    formData.append("documentType", selectedDocumentType);
    formData.append("email", session?.user.email || "");

    if (session?.user?.roleId === 3 && selectedGroup) {
      formData.append("groupId", selectedGroup);
    }

    if (session?.user?.roleId === 4 && selectedSubject && selectedSemester) {
      formData.append("subjectId", selectedSubject);
      formData.append("semesterId", selectedSemester);
      formData.append("isGlobal", "true");
    }

    if (replace) formData.append("replace", "true");

    try {
      const response = await fetch("/api/document", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.status === 409 && result.replace) {
        setOpenDialog(true);
        setIsLoading(false);
        return;
      }

      if (response.ok) {
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

        toast({
          title: "¡Éxito!",
          description: "Archivo subido exitosamente",
        });
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
    } finally {
      setIsLoading(false);
    }
  };

  const confirmReplace = async () => {
    setOpenDialog(false);
    await uploadFile(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Subida de archivos</h1>

      <DocumentTypeSelector
        documentTypes={documentTypes}
        selectedDocumentType={selectedDocumentType}
        setSelectedDocumentType={setSelectedDocumentType}
      />

      {session?.user?.roleId === 3 && (
        <GroupSelector
          groups={groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
      )}

      {session?.user?.roleId === 4 && (
        <SubjectSemesterSelector
          subjects={subjects}
          semesters={semesters}
          selectedSubject={selectedSubject}
          selectedSemester={selectedSemester}
          setSelectedSubject={setSelectedSubject}
          setSelectedSemester={setSelectedSemester}
        />
      )}

      <FileInput handleFileChange={handleFileChange} />

      <FileItemDisplay fileItem={fileItem} removeFile={removeFile} />

      <Button
        onClick={() => uploadFile()}
        className="mt-4"
        disabled={isLoading} // Desactivar el botón cuando isLoading es true
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // Spinner dentro del botón
        ) : (
          "Cargar documento"
        )}
      </Button>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reemplazar archivo?</AlertDialogTitle>
            <AlertDialogDescription>
              El archivo ya existe. Esta acción reemplazará el archivo existente
              con el nuevo archivo subido.
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
  );
}
