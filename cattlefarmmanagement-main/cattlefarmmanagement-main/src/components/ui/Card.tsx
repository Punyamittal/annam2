interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
  }
  
  export function Card({ children, className = '', title, action }: CardProps) {
    return (
<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
  {(title || action) && (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
      {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>}
      {action && <div>{action}</div>}
    </div>
  )}
  <div className="p-4 text-gray-900 dark:text-gray-100">{children}</div>
</div>
    );
  }