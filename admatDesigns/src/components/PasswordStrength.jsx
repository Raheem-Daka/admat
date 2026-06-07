const PasswordStrength = ({ password, strength, rules }) => {
  if (!password) return null;

  return (
    <div className="mb-3">
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-2 transition-all duration-300 ${strength.color}`}
          style={{ width: strength.width }}
        />
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Strength: <span className="font-medium">{strength.label}</span>
      </p>

      <ul className="text-xs text-gray-400 mt-2 space-y-1">
        <li>{rules.length ? "✔" : "○"} At least 6 characters</li>
        <li>{rules.upper ? "✔" : "○"} One uppercase letter</li>
        <li>{rules.number ? "✔" : "○"} One number</li>
        <li>{rules.special ? "✔" : "○"} One special character</li>
      </ul>
    </div>
  );
};

export default PasswordStrength;