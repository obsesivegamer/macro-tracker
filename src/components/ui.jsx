// Modern UI components with enhanced design system integration

export const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md", 
  className = "",
  disabled = false,
  loading = false,
  fullWidth = false,
  type = "button",
  ...props 
}) => {
  const baseClasses = "button-base rounded-lg";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-button hover:shadow-button-hover",
    secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200 active:bg-secondary-300 border border-secondary-300",
    outline: "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 active:bg-neutral-100",
    ghost: "text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200",
    destructive: "bg-error-600 text-white hover:bg-error-700 active:bg-error-800 shadow-button hover:shadow-button-hover",
    success: "bg-success-600 text-white hover:bg-success-700 active:bg-success-800 shadow-button hover:shadow-button-hover",
    warning: "bg-warning-600 text-white hover:bg-warning-700 active:bg-warning-800 shadow-button hover:shadow-button-hover"
  };
  
  const sizes = {
    sm: "h-9 px-3 text-sm gap-1.5",
    md: "h-10 px-4 text-sm gap-2", 
    lg: "h-11 px-6 text-base gap-2",
    xl: "h-12 px-8 text-lg gap-2.5",
    icon: "h-10 w-10 p-0"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  const loadingClass = loading ? "opacity-75 cursor-wait" : "";
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${loadingClass} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", variant = "default", interactive = false, ...props }) => {
  const baseClasses = "card-base rounded-lg";
  
  const variants = {
    default: "bg-white border-neutral-200 shadow-card",
    elevated: "bg-white border-neutral-200 shadow-md",
    outlined: "bg-white border-2 border-neutral-300 shadow-none"
  };
  
  const interactiveClasses = interactive ? "card-interactive cursor-pointer" : "";
  
  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", size = "default", ...props }) => {
  const sizes = {
    sm: "p-4 pb-2",
    default: "p-6 pb-3", 
    lg: "p-8 pb-4"
  };
  
  return (
    <div className={`flex flex-col space-y-1.5 ${sizes[size]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = "", level = 3, ...props }) => {
  const levels = {
    1: "text-3xl font-bold",
    2: "text-2xl font-bold", 
    3: "text-xl font-semibold",
    4: "text-lg font-semibold",
    5: "text-base font-medium",
    6: "text-sm font-medium"
  };
  
  const Tag = `h${level}`;
  
  return (
    <Tag className={`${levels[level]} leading-tight tracking-tight text-neutral-900 text-balance ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export const CardDescription = ({ children, className = "", ...props }) => {
  return (
    <p className={`text-sm text-neutral-600 text-pretty ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = "", size = "default", ...props }) => {
  const sizes = {
    sm: "p-4 pt-0",
    default: "p-6 pt-0",
    lg: "p-8 pt-0"
  };
  
  return (
    <div className={`${sizes[size]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = "", size = "default", ...props }) => {
  const sizes = {
    sm: "p-4 pt-0",
    default: "p-6 pt-0",
    lg: "p-8 pt-0"
  };
  
  return (
    <div className={`flex items-center ${sizes[size]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const Input = ({ 
  className = "", 
  type = "text",
  size = "md",
  error = false,
  icon = null,
  ...props 
}) => {
  const baseClasses = "input-base rounded-lg";
  
  const sizes = {
    sm: "h-9 text-sm px-3",
    md: "h-10 text-sm px-3", 
    lg: "h-11 text-base px-4",
    xl: "h-12 text-base px-4"
  };
  
  const stateClasses = error 
    ? "border-error-300 focus-ring-error" 
    : "border-neutral-300 focus-ring";
  
  const iconPadding = icon ? "pl-10" : "";
  
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={`${baseClasses} ${sizes[size]} ${stateClasses} ${iconPadding} file:border-0 file:bg-transparent file:text-sm file:font-medium ${className}`}
        {...props}
      />
    </div>
  );
};

export const Select = ({ 
  children, 
  value, 
  onValueChange, 
  className = "",
  size = "md",
  error = false,
  placeholder = "Select an option...",
  ...props 
}) => {
  const baseClasses = "input-base rounded-lg appearance-none bg-no-repeat bg-right bg-[length:16px_16px] pr-10";
  const bgImage = "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')]";
  
  const sizes = {
    sm: "h-9 text-sm px-3",
    md: "h-10 text-sm px-3",
    lg: "h-11 text-base px-4",
    xl: "h-12 text-base px-4"
  };
  
  const stateClasses = error 
    ? "border-error-300 focus-ring-error" 
    : "border-neutral-300 focus-ring";
  
  return (
    <select
      value={value}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className={`${baseClasses} ${bgImage} ${sizes[size]} ${stateClasses} ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
};

export const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  className = "",
  ...props 
}) => {
  const variants = {
    default: "bg-primary-100 text-primary-800 border-primary-200",
    secondary: "bg-secondary-100 text-secondary-800 border-secondary-200",
    destructive: "bg-error-100 text-error-800 border-error-200",
    success: "bg-success-100 text-success-800 border-success-200",
    warning: "bg-warning-100 text-warning-800 border-warning-200",
    neutral: "bg-neutral-100 text-neutral-800 border-neutral-200",
    outline: "bg-white text-neutral-700 border-neutral-300"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-0.5 text-xs gap-1",
    lg: "px-3 py-1 text-sm gap-1.5"
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium border transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export const Tabs = ({ children, className = "", ...props }) => {
  return (
    <div className={`w-full space-y-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const TabsList = ({ children, className = "", size = "md", variant = "default", ...props }) => {
  const sizes = {
    sm: "h-9 p-1",
    md: "h-10 p-1",
    lg: "h-11 p-1.5"
  };
  
  const variants = {
    default: "bg-neutral-100 text-neutral-600 shadow-inner",
    pills: "bg-transparent text-neutral-600 gap-1",
    underline: "bg-transparent border-b border-neutral-200"
  };
  
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ 
  children, 
  value, 
  isActive = false, 
  onClick,
  className = "",
  size = "md",
  variant = "default",
  ...props 
}) => {
  const sizes = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2"
  };
  
  const variants = {
    default: isActive 
      ? 'bg-white text-neutral-900 shadow-sm' 
      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50',
    pills: isActive
      ? 'bg-primary-600 text-white shadow-sm'
      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
    underline: isActive
      ? 'text-primary-600 border-b-2 border-primary-600'
      : 'text-neutral-600 hover:text-neutral-900 border-b-2 border-transparent'
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-ring disabled:pointer-events-none disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
      onClick={() => onClick && onClick(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ 
  children, 
  value, 
  activeTab,
  className = "",
  ...props 
}) => {
  if (value !== activeTab) return null;
  
  return (
    <div 
      className={`animate-fade-in focus-ring ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Progress component for nutrient tracking
export const Progress = ({ 
  value = 0, 
  max = 100, 
  className = "",
  size = "md",
  variant = "default",
  showLabel = false,
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  const variants = {
    default: "bg-primary-600",
    success: "bg-success-600",
    warning: "bg-warning-600",
    error: "bg-error-600"
  };
  
  return (
    <div className={`relative ${className}`} {...props}>
      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`h-full transition-all duration-300 ease-out ${variants[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-neutral-700">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

// Alert component for notifications and status messages
export const Alert = ({ 
  children, 
  variant = "default", 
  className = "",
  ...props 
}) => {
  const variants = {
    default: "bg-neutral-50 border-neutral-200 text-neutral-900",
    success: "bg-success-50 border-success-200 text-success-900",
    warning: "bg-warning-50 border-warning-200 text-warning-900",
    error: "bg-error-50 border-error-200 text-error-900",
    info: "bg-primary-50 border-primary-200 text-primary-900"
  };
  
  return (
    <div 
      className={`rounded-lg border p-4 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = "", ...props }) => {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h5>
  );
};

export const AlertDescription = ({ children, className = "", ...props }) => {
  return (
    <div className={`text-sm opacity-90 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Skeleton component for loading states
export const Skeleton = ({ 
  className = "",
  variant = "default",
  ...props 
}) => {
  const variants = {
    default: "bg-neutral-200",
    text: "bg-neutral-200 h-4 rounded",
    avatar: "bg-neutral-200 rounded-full",
    button: "bg-neutral-200 h-10 rounded-lg"
  };
  
  return (
    <div 
      className={`animate-pulse ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

// Separator component for visual division
export const Separator = ({ 
  orientation = "horizontal", 
  className = "",
  ...props 
}) => {
  const orientationClasses = orientation === "horizontal" 
    ? "h-px w-full" 
    : "w-px h-full";
  
  return (
    <div 
      className={`bg-neutral-200 ${orientationClasses} ${className}`}
      {...props}
    />
  );
};

// Label component for form fields
export const Label = ({ 
  children, 
  htmlFor,
  className = "",
  required = false,
  ...props 
}) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`text-sm font-medium text-neutral-900 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-error-600 ml-1">*</span>}
    </label>
  );
};

// Helper text component for form fields
export const HelperText = ({ 
  children, 
  error = false,
  className = "",
  ...props 
}) => {
  const textColor = error ? "text-error-600" : "text-neutral-600";
  
  return (
    <p className={`text-xs mt-1 ${textColor} ${className}`} {...props}>
      {children}
    </p>
  );
};

// Loading spinner component
export const Spinner = ({ 
  size = "md", 
  className = "",
  ...props 
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };
  
  return (
    <svg 
      className={`animate-spin ${sizes[size]} ${className}`}
      fill="none" 
      viewBox="0 0 24 24"
      {...props}
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};