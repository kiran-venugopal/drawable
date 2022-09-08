/* eslint-disable react/display-name */
import { forwardRef } from 'react';

const CursorIcon = forwardRef<any, { style: any }>((props, ref) => (
  <svg
    ref={ref as any}
    style={props.style}
    width='14'
    height='17'
    viewBox='0 0 14 17'
    fill='grey'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M1.636 0.286997C1.48966 0.166392 1.31205 0.0898807 1.12388 0.0663889C0.935712 0.0428971 0.744741 0.0733929 0.573245 0.154319C0.401749 0.235245 0.256798 0.363265 0.1553 0.523446C0.0538017 0.683627 -5.89237e-05 0.869366 4.83745e-08 1.059V15.057C4.83745e-08 15.984 1.15 16.412 1.756 15.712L5.28 11.639C5.42082 11.4764 5.59497 11.346 5.79064 11.2566C5.9863 11.1672 6.19889 11.121 6.414 11.121H12.006C12.944 11.121 13.366 9.945 12.642 9.349L1.636 0.286997Z' />
  </svg>
));

export default CursorIcon;
