import { ReactEventHandler } from 'react';
import { placeholderImgPath } from '~/constants/urls';

export const handleImageError: ReactEventHandler<HTMLImageElement> = (e) => {
  const target = e.target as HTMLImageElement;
  target.setAttribute('src', placeholderImgPath);
};
