import Button from "@/components/ui/button";

const SwitchGroup = ({ label, value, onChange }) => {
  const options = ["Mandatory", "Optional", "Off"];

  return (
    <div className="flex justify-between items-center py-2 border-b border-neutral-40">
      <span className="text-sm text-neutral-90">{label}</span>

      <div className="flex gap-2">
        {options.map((opt) => {
          const isActive = value === opt;

          return (
            <Button
              key={opt}
              size="very-small"
              label={opt}
              onClick={() => onChange(opt)}
              variant={isActive ? "primary" : "tertiary"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SwitchGroup;
