import { FiEye, FiEyeOff } from "react-icons/fi"
export default function SigninField({
  name,
  label,
  type,
  placeholder,
  value,
  error,
  onChange,
  onFocus,
  toggle,
  showPassword,
  setShowPassword,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-primary/80 dark:text-white/80">{label}</label>
      <div className="relative">
        <input
          autoComplete="true"
          required="true"
          type={toggle ? (showPassword[toggle] ? "text" : "password") : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          className={`w-full h-12 pl-3 pr-${toggle ? "10" : "3"} rounded-lg border ${
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-primary/20"
          } bg-background-light/30 dark:bg-white/5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm text-primary/90 dark:text-white`}
        />
        {toggle && setShowPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary"
            onClick={() => setShowPassword((prev) => ({ ...prev, [toggle]: !prev[toggle] }))}
          >
            <span className="material-symbols-outlined text-lg">
              {showPassword[toggle] ? <FiEye /> : <FiEyeOff />}
            </span>
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}
