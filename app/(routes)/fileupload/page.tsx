"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/spinner";
import { toast } from "@/hooks/use-toast";
import { getGroupsByMentor } from "@/actions/getGroupsByMentor";
import { getDocumentTypes } from "@/actions/getDocumentTypes";
import { getSubjects } from "@/actions/getSubjects";
import { getSemesters } from "@/actions/getSemesters";
import { getGroups } from "@/actions/getGroups";
import { FileItem } from "@/types/global.types";
import { Loader2 } from "lucide-react";
import { FileInput } from "./components/dropzone";
import { FileItemDisplay } from "./components/file-item-display";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import {
  SubjectSelector,
  SemesterSelector,
  DocumentTypeSelector,
  GroupSelector,
} from "@/components/selector";
import { useFetchData } from "@/hooks/use-fetch-data";

export default function FileUploadPage() {
  const [fileItem, setFileItem] = useState<FileItem | null>(null);

  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const [isGlobal, setIsGlobal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  const handleFileChange = (file: FileItem) => {
    setFileItem(file);
  };

  const {
    data: documentTypes,
    loading: documentTypesLoading,
    error: documentTypesError,
  } = useFetchData(getDocumentTypes);

  const {
    data: semesters,
    loading: semestersLoading,
    error: semestersError,
  } = useFetchData(getSemesters);

  const {
    data: subjects,
    loading: subjectsLoading,
    error: subjectsError,
  } = useFetchData(getSubjects);

  const fetchFunction =
    session?.user?.roleId === 3 ? getGroupsByMentor : getGroups;
  const shouldFetch =
    session?.user?.roleId === 4 ||
    (session?.user?.roleId === 3 && !!session.user.email);
  const params =
    session?.user?.roleId === 3 && session.user.email
      ? ([session.user.email] as [string])
      : undefined;

  const {
    data: groups,
    loading,
    error,
  } = useFetchData(fetchFunction, { shouldFetch, params });

  const removeFile = () => {
    setFileItem(null);
  };

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

    if (session?.user?.roleId === 4) {
      if (isGlobal && selectedSubject && selectedSemester) {
        formData.append("subjectId", selectedSubject);
        formData.append("semesterId", selectedSemester);
        formData.append("isGlobal", "true");
      } else if (!isGlobal && selectedGroup) {
        formData.append("groupId", selectedGroup);
      }
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

  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Subida de archivos</h1>

      <DocumentTypeSelector
        documentTypes={documentTypes || []}
        selectedDocumentType={selectedDocumentType}
        setSelectedDocumentType={setSelectedDocumentType}
        loading={documentTypesLoading}
        error={documentTypesError}
      />

      {session?.user?.roleId === 4 && (
        <div className="flex items-center gap-x-2 mb-4">
          <Checkbox
            checked={isGlobal}
            onCheckedChange={(checked) => setIsGlobal(!!checked)}
          />
          <label className="flex items-center space-x-2">
            <span>Archivo Global</span>
          </label>
        </div>
      )}

      {!isGlobal && session?.user?.roleId === 4 && (
        <GroupSelector
          groups={groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
      )}

      {session?.user?.roleId === 3 && (
        <GroupSelector
          groups={groups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
      )}

      {isGlobal && session?.user?.roleId === 4 && (
        <>
          <SubjectSelector
            subjects={subjects}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            loading={subjectsLoading}
            error={subjectsError}
          />

          <SemesterSelector
            semesters={semesters}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            loading={semestersLoading}
            error={semestersError}
          />
        </>
      )}

      <FileInput handleFileChange={handleFileChange} />

      <FileItemDisplay fileItem={fileItem} removeFile={removeFile} />

      <Button
        onClick={() => uploadFile()}
        className="mt-4"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Cargar documento"
        )}
      </Button>

      <ConfirmationDialog
        isOpen={openDialog}
        onOpenChange={setOpenDialog}
        title="¿Reemplazar archivo?"
        description="El archivo ya existe. Esta acción reemplazará el archivo existente con el nuevo archivo subido."
        confirmText="Reemplazar"
        cancelText="Cancelar"
        onConfirm={confirmReplace}
      />
    </div>
  );
}
