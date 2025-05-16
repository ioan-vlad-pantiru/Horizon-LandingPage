import React from "react";

interface HelmetIconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

const HelmetIcon: React.FC<HelmetIconProps> = ({ className = "", ...props }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        {/* Simple motorcycle helmet shape */}
        <path d="M4 12a8 8 0 0116 0v2a2 2 0 01-2 2h-7l-4 2.5V12z" />
        <path d="M12 4v3" />
        <path d="M16 20a2 2 0 01-2-2" />
    </svg>
);

export default HelmetIcon;