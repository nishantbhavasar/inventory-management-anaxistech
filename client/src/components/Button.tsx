import React from 'react';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  text: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'other';
  width?: string;
  fillLoader?: string;
  borderColor?: string;
  loaderHW?: number;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({
  className = '',
  onClick,
  text,
  type = 'button',
  loading = false,
  disabled = false,
  variant = 'primary',
  width,
  fillLoader,
  borderColor,
  loaderHW,
  title
}) => {
  return (
    <button
      className={clsx(
        `py-2 px-3 rounded-md text-sm sm:text-lg font-semibold transition-all duration-200 hover:shadow-[0px_0px_14px_rgba(0,0,0,0.15)]`,
        {
          'bg-gradient-to-t from-[#FF8800] to-[#FFA033] text-white':
            variant === 'primary',
          'border-1 border-[#FF8800] text-gray-700 bg-transparent hover:border-primary-100':
            variant === 'outline',
          'opacity-80 cursor-not-allowed justify-center items-center flex': loading || disabled,
          'cursor-pointer': !(loading || disabled),
        },
        borderColor && 'border-2 bg-transparent',
        width ? width : 'w-full',
        className
      )}
      onClick={onClick}
      type={type}
      disabled={disabled}
      title={title}
      style={borderColor ? { borderColor: borderColor } : {}}
    >
      {!loading ? (
        text
      ) : (
        <LoaderCircle
          height={loaderHW ?? 24}
          className='animate-spin'
          width={loaderHW ?? 24}
        />
      )}
    </button>
  );
};

export default Button;
