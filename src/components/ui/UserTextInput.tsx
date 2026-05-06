// import { useAppStore } from "./appStore";

interface TextInputProps {
  value?: number;
  placeholder?: string;
  step?: number;
  filename?: string;
  width?: number | string;
  disabled?: boolean;
  label: string;
  onChange?: (value: string) => void;
}

export default function UserTextInput({
  filename = "",
  onChange,
  placeholder = "Enter text...",
  label = "Input",
  width = "w-full",
}: TextInputProps) {
  return (
    <div
      className={`mb-8 items-center w-full h-full grid gap-6 md:grid-cols-1`}
    >
      <div className={`w-full ${width}`}>
        {/* Card */}
        <div className="flex flex-row gap-8 p-6 bg-linear-to-br from-white to-sky-50 w-full rounded-xl border border-white/60 shadow-sm">
          {/* Field */}
          <div className="flex items-center justify-center flex-row group">
            <label
              htmlFor="text-input"
              className="block text-2xl mr-4 text-black mb-1"
            >
              4.&nbsp;&nbsp;{label}:
            </label>

            <div className="relative">
              <input
                id="text-input"
                type="text"
                value={filename}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className="
                  w-full 
                  text-black placeholder-gray-500 border shadow-sm border-gray-300
                  px-4 py-3 text-sm tracking-wide
                  outline-none
                  rounded-lg
                  focus:border-amber-500
                  transition-colors duration-200
                  pr-10
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
