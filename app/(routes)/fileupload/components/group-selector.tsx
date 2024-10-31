import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Group } from "@/types/global.types";
import { Info, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GroupSelectorProps {
  groups: Group[];
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
}

export function GroupSelector({
  groups,
  selectedGroup,
  setSelectedGroup,
}: GroupSelectorProps) {
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [isActiveGroup, setIsActiveGroup] = useState<boolean>(false);

  return (
    <div className="relative flex items-start justify-start flex-wrap sm:flex-nowrap">
      <div className="flex flex-col items-start justify-center w-full">
        <label className="mb-2 text-lg">Selecciona un grupo</label>
        <Select onValueChange={setSelectedGroup} value={selectedGroup}>
          <SelectTrigger className="border p-2 rounded-lg mb-4 max-w-xl">
            <SelectValue placeholder="Selecciona un grupo" />
          </SelectTrigger>
          <SelectContent className="z-10">
            <SelectGroup>
              <SelectLabel>Mis grupos</SelectLabel>
              {groups.map((group) => (
                <SelectItem
                  key={group.id}
                  value={String(group.id)}
                  onMouseEnter={() => (
                    setActiveGroup(group), setIsActiveGroup(true)
                  )}
                  onMouseLeave={() => (
                    setActiveGroup(null), setIsActiveGroup(false)
                  )}
                >
                  <div className="relative flex justify-between items-center w-72 sm:w-80">
                    <span>
                      {group.name} - {group.subject} ({group.semester})
                    </span>
                    <Info className="absolute -right-48 h-4 w-4 hidden sm:block" />
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Card className={`${isActiveGroup ? "block" : "hidden"} mb-4 sm:mb-0`}>
        {activeGroup && (
          <>
            <CardHeader className="relative mb-0 pb-1">
              <CardTitle className="text-sm">Estudiantes:</CardTitle>
              <Button
                variant={"ghost"}
                size={"sm"}
                className="absolute top-0 right-1"
                onClick={() => (setActiveGroup(null), setIsActiveGroup(false))}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {activeGroup.students.length > 0 ? (
                <ul className="list-disc pl-4">
                  {activeGroup.students.map((student, index) => (
                    <li key={index} className="text-xs">
                      {student}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sin estudiantes</p>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
