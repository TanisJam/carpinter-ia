import { OptionCard } from "./OptionCard";

interface Option {
  id: string;
  icon: string;
  title: string;
  description: string;
  route: string;
}

interface OptionsSectionProps {
  options: Option[];
}

export function OptionsSection({ options }: OptionsSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full space-y-3">
      {options.map((option) => (
        <OptionCard
          key={option.id}
          icon={option.icon}
          title={option.title}
          description={option.description}
          route={option.route}
        />
      ))}
    </div>
  );
}
