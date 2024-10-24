import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GroupSelectorProps {
  groups: { id: number; name: string; subject: string; semester: string }[];
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
}

export function GroupSelector({
  groups,
  selectedGroup,
  setSelectedGroup,
}: GroupSelectorProps) {
  return (
    <div>
      <label className="mb-2 text-lg">Selecciona un grupo</label>
      <Select onValueChange={setSelectedGroup} value={selectedGroup}>
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
  );
}
