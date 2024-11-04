"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { closeSemester } from "@/actions/closeSemester";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Loader2 } from "lucide-react";
import { getSemesters } from "@/actions/getSemesters";
import { getSubjects } from "@/actions/getSubjects";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { SemesterSelector, SubjectSelector } from "@/components/selector";
import { toast } from "@/hooks/use-toast";

export function CloseSemesterControl() {
  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(
    undefined
  );
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleConfirmCloseSemester = async () => {
    if (selectedSemester && selectedSubject) {
      setIsLoading(true);
      try {
        await closeSemester(selectedSemester, selectedSubject);
        setIsDialogOpen(false);
        toast({
          title: "¡Éxito!",
          description: `El semestre ${selectedSemester} para la asignatura ${selectedSubject} se ha cerrado correctamente.`,
          variant: "default",
        });
      } catch (error) {
        console.error("Error al cerrar el semestre:", error);
        toast({
          title: "Error",
          description: "Hubo un error al intentar cerrar el semestre.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-6">
      <h2 className="text-base font-medium">Cerrar Semestre Académico</h2>

      <SemesterSelector
        semesters={semesters}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        loading={semestersLoading}
        error={semestersError}
        valueType="name"
      />

      <SubjectSelector
        subjects={subjects}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        loading={subjectsLoading}
        error={subjectsError}
        valueType="name"
      />

      <Button
        onClick={() => setIsDialogOpen(true)}
        disabled={!selectedSemester || !selectedSubject || isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Cerrar Semestre"
        )}
      </Button>

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Confirmar cierre de semestre"
        description={`Está a punto de cerrar el semestre ${selectedSemester} para la asignatura ${selectedSubject}. ¿Desea continuar?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmCloseSemester}
      />
    </div>
  );
}
