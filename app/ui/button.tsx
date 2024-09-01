import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'tertiary' | 'ghost';
}

export function Button({
  children,
  className,
  variant = 'primary',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'h-10 rounded-lg px-4 py-2 inline-flex w-full items-center justify-center text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2  aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        {
          ' active:bg-blue-600 hover:bg-blue-400 bg-blue-500 text-white':
            variant === 'primary',
          'bg-gray-200 hover:bg-gray-100 active:bg-gray-300 text-black':
            variant === 'secondary',
          ' active:bg-red-600 hover:bg-red-400 bg-red-500 text-white':
            variant === 'destructive',
          'bg-white ring-offset-background border border-input bg-background hover:bg-accent hover:text-accent-foreground':
            variant === 'tertiary',
          'bg-transparent': variant === 'ghost',
        },

        className
      )}
    >
      {children}
    </button>
  );
}
