import './divider-style.css';

export type DividerPropsType = {
  text: string;
};

function Divider({ text }: DividerPropsType) {
  return (
    <div className='divider'>
      <div className='line'></div>
      <div className='text'>{text}</div>
      <div className='line'></div>
    </div>
  );
}

export default Divider;
