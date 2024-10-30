// components/GuideDialog.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function GuideDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mostrar el diálogo automáticamente la primera vez
    const hasSeenGuide = localStorage.getItem("hasSeenGuide");
    if (!hasSeenGuide) {
      setIsOpen(true);
      localStorage.setItem("hasSeenGuide", "true");
    }
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="absolute sm:top-4 -top-8 sm:right-8 right-0 text-base"
          >
            📖 Guía
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Guía para realizar preguntas</DialogTitle>
          <DialogDescription>
            Aquí tienes algunas instrucciones para preguntar por documentos
            específicos:
          </DialogDescription>
          <DialogDescription>
            <ul className="list-disc pl-5 mt-2 px-8">
              <li>
                Para preguntar sobre una &quot;rúbrica&quot;, incluye la palabra
                &quot;rúbrica&quot; en tu pregunta.
              </li>
              <li>
                Para preguntar sobre un &quot;informe&quot;, incluye la palabra
                &quot;informe&quot; en tu pregunta.
              </li>
              <li>
                Para preguntar sobre una &quot;bitácora&quot;, incluye la
                palabra &quot;bitácora&quot; en tu pregunta.
              </li>
              <li>
                Para preguntar sobre una &quot;directiva&quot;, incluye la
                palabra &quot;directiva&quot; en tu pregunta.
              </li>
            </ul>
          </DialogDescription>

          {/* <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button> */}

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
