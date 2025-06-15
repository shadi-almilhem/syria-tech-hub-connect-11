
import { Label } from "@/components/ui/label";

type Role = "trainee" | "expert" | "company" | "admin";

const ROLES: { value: Role; label: string }[] = [
  { value: "trainee", label: "Trainee" },
  { value: "expert", label: "Expert" },
  { value: "company", label: "Company" },
  { value: "admin", label: "Admin" },
];

export default function RoleSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: Role;
  onChange: (role: Role) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <Label htmlFor="role">Account Type</Label>
      <select
        id="role"
        required
        value={value}
        onChange={e => onChange(e.target.value as Role)}
        className="w-full border rounded px-3 py-2"
        disabled={disabled}
      >
        {ROLES.map(r => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}

