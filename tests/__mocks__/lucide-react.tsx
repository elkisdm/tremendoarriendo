import React from 'react';

const createIcon = (name: string) => {
  const Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg data-testid={`icon-${name}`} {...props} />
  );
  Icon.displayName = name;
  return Icon;
};

export const Calendar = createIcon('Calendar');
export const MessageSquare = createIcon('MessageSquare');
export const Phone = createIcon('Phone');
export const Mail = createIcon('Mail');
export const User = createIcon('User');
export const CheckCircle = createIcon('CheckCircle');
export const AlertCircle = createIcon('AlertCircle');
export const Loader2 = createIcon('Loader2');

export default {} as any;


