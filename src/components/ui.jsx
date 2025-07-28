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

// Enhanced Progress component for nutrient tracking with animations and icons
export const Progress = ({ 
  value = 0, 
  max = 100, 
  className = "",
  size = "md",
  variant = "default",
  showLabel = false,
  showIcon = false,
  animated = false,
  striped = false,
  gradient = false,
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    xs: "h-1.5",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-6"
  };
  
  const variants = {
    default: gradient ? "bg-gradient-to-r from-primary-500 to-primary-600" : "bg-primary-600",
    success: gradient ? "bg-gradient-to-r from-success-500 to-success-600" : "bg-success-600",
    warning: gradient ? "bg-gradient-to-r from-warning-500 to-warning-600" : "bg-warning-600",
    error: gradient ? "bg-gradient-to-r from-error-500 to-error-600" : "bg-error-600",
    info: gradient ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-blue-600",
    purple: gradient ? "bg-gradient-to-r from-purple-500 to-purple-600" : "bg-purple-600"
  };
  
  const icons = {
    success: "✓",
    warning: "⚠",
    error: "✗",
    default: "●"
  };
  
  const stripedClass = striped ? "bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%]" : "";
  const animatedClass = animated ? "animate-pulse" : "";
  const glowClass = percentage > 90 ? "shadow-lg shadow-current/20" : "";
  
  return (
    <div className={`relative ${className}`} {...props}>
      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden shadow-inner ${sizes[size]}`}>
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${variants[variant]} ${stripedClass} ${animatedClass} ${glowClass}`}
          style={{ 
            width: `${percentage}%`,
            transform: `scaleX(${percentage / 100})`,
            transformOrigin: 'left',
            animation: striped ? 'progress-stripes 2s linear infinite' : undefined
          }}
        />
      </div>
      {(showLabel || showIcon) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {showIcon && (
            <span className="text-xs mr-1 text-neutral-700 font-bold drop-shadow-sm">
              {icons[variant] || icons.default}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-semibold text-neutral-700 drop-shadow-sm">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Circular Progress component for status displays
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = true,
  strokeWidth = 4,
  className = "",
  children,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: { width: 40, height: 40, fontSize: "text-xs" },
    md: { width: 60, height: 60, fontSize: "text-sm" },
    lg: { width: 80, height: 80, fontSize: "text-base" },
    xl: { width: 120, height: 120, fontSize: "text-lg" }
  };
  
  const variants = {
    default: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444"
  };
  
  const { width, height, fontSize } = sizes[size];
  const radius = (width - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} {...props}>
      <svg width={width} height={height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke={variants[variant]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{
            filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))'
          }}
        />
      </svg>
      {(showLabel || children) && (
        <div className={`absolute inset-0 flex items-center justify-center ${fontSize} font-semibold text-neutral-700`}>
          {children || `${Math.round(percentage)}%`}
        </div>
      )}
    </div>
  );
};

// Enhanced Nutrient Progress component for detailed nutrient tracking
export const NutrientProgress = ({
  nutrient,
  current = 0,
  target = 100,
  unit = "mg",
  status = "default",
  showPercentage = true,
  showValues = true,
  animated = true,
  size = "md",
  className = "",
  ...props
}) => {
  const percentage = Math.min(Math.max((current / target) * 100, 0), 100);
  
  const sizes = {
    sm: { height: "h-2", text: "text-xs", spacing: "space-y-1" },
    md: { height: "h-3", text: "text-sm", spacing: "space-y-2" },
    lg: { height: "h-4", text: "text-base", spacing: "space-y-2" }
  };
  
  const statusVariants = {
    low: { variant: "error", icon: "⚠", color: "text-error-700" },
    moderate: { variant: "warning", icon: "◐", color: "text-warning-700" },
    good: { variant: "success", icon: "✓", color: "text-success-700" },
    high: { variant: "info", icon: "↑", color: "text-blue-700" },
    default: { variant: "default", icon: "●", color: "text-neutral-700" }
  };
  
  const config = statusVariants[status] || statusVariants.default;
  const sizeConfig = sizes[size];
  
  return (
    <div className={`${sizeConfig.spacing} ${className}`} {...props}>
      {/* Header with nutrient name and status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`${sizeConfig.text} font-medium text-neutral-900 capitalize`}>
            {nutrient.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className={`${config.color} font-bold text-xs`}>
            {config.icon}
          </span>
        </div>
        {showPercentage && (
          <span className={`${sizeConfig.text} font-semibold ${config.color}`}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      
      {/* Progress bar */}
      <Progress
        value={current}
        max={target}
        variant={config.variant}
        size={size}
        animated={animated}
        gradient={true}
        className="w-full"
      />
      
      {/* Values display */}
      {showValues && (
        <div className="flex justify-between items-center">
          <span className={`${sizeConfig.text} text-neutral-600`}>
            {Math.round(current * 10) / 10} {unit}
          </span>
          <span className={`${sizeConfig.text} text-neutral-500`}>
            Target: {target} {unit}
          </span>
        </div>
      )}
    </div>
  );
};

// Status Indicator component with icons and animations
export const StatusIndicator = ({
  status = "default",
  size = "md",
  animated = false,
  showIcon = true,
  showText = true,
  text,
  pulse = false,
  className = "",
  ...props
}) => {
  const statuses = {
    success: {
      color: "text-success-700",
      bg: "bg-success-100",
      border: "border-success-200",
      icon: "✓",
      text: "Good",
      glow: "shadow-success-200/50"
    },
    warning: {
      color: "text-warning-700", 
      bg: "bg-warning-100",
      border: "border-warning-200",
      icon: "⚠",
      text: "Warning",
      glow: "shadow-warning-200/50"
    },
    error: {
      color: "text-error-700",
      bg: "bg-error-100", 
      border: "border-error-200",
      icon: "✗",
      text: "Low",
      glow: "shadow-error-200/50"
    },
    info: {
      color: "text-blue-700",
      bg: "bg-blue-100",
      border: "border-blue-200", 
      icon: "ℹ",
      text: "Info",
      glow: "shadow-blue-200/50"
    },
    high: {
      color: "text-purple-700",
      bg: "bg-purple-100",
      border: "border-purple-200",
      icon: "↑",
      text: "High",
      glow: "shadow-purple-200/50"
    },
    default: {
      color: "text-neutral-700",
      bg: "bg-neutral-100",
      border: "border-neutral-200",
      icon: "●",
      text: "Status",
      glow: "shadow-neutral-200/50"
    }
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5", 
    lg: "px-4 py-2 text-base gap-2"
  };
  
  const statusConfig = statuses[status] || statuses.default;
  const animatedClass = animated ? "animate-pulse" : "";
  const pulseClass = pulse ? `animate-pulse shadow-lg ${statusConfig.glow}` : "";
  
  return (
    <div 
      className={`inline-flex items-center rounded-full font-medium border transition-all duration-300 hover:scale-105 ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color} ${sizes[size]} ${animatedClass} ${pulseClass} ${className}`}
      {...props}
    >
      {showIcon && (
        <span className="font-bold animate-bounce-subtle">
          {statusConfig.icon}
        </span>
      )}
      {showText && (
        <span>
          {text || statusConfig.text}
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