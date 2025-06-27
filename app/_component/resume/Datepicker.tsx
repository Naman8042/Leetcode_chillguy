import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const DatePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelected(date);
      onChange(format(date, "yyyy-MM-dd"));
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          value={selected ? format(selected, "yyyy-MM-dd") : ""}
          placeholder="Select date"
          readOnly
          onClick={() => setOpen(!open)}
          className="p-2 border text-base md:text-sm rounded-md w-full outline-none"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          captionLayout="dropdown-years"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker