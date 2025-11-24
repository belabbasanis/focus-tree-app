import { ICON } from '../../lib/ui';

interface CustomIconProps {
  src: string;
  alt: string;
  className?: string;
}

const CustomIcon = ({ 
  src, 
  alt, 
  className = "w-3 h-3" 
}: CustomIconProps) => (
  <img 
    src={src} 
    alt={alt} 
    className={className}
    style={ICON.pixel}
  />
);

export default CustomIcon;

