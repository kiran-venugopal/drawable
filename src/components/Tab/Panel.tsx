import { FC } from 'react';

const Panel: FC<{ children: any; title: any }> = (props) => {
  return <div>{props.children}</div>;
};

export default Panel;
