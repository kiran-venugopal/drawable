import './tab-style.css';

export type TabProps = {
  children: any;
  selectedIndex: number;
  onSelect(index: number): void;
};

export default function Tab({
  children,
  selectedIndex = 0,
  onSelect = () => {
    return;
  },
}: TabProps) {
  const isMuliElements = Array.isArray(children);

  const onTabClick = (index: number) => {
    onSelect(index);
  };

  return (
    <div className='tab-container'>
      <ul>
        {isMuliElements ? (
          children.map((elem: any, index: number) => {
            const style = index === selectedIndex ? 'selected' : '';
            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <li key={index} className={style} onClick={() => onTabClick(index)}>
                {elem.props.title}
              </li>
            );
          })
        ) : (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <li className='selected' onClick={() => onTabClick(0)}>
            {children.props.title}
          </li>
        )}
      </ul>
      <div className='tab'>{isMuliElements ? children[selectedIndex] : children}</div>
    </div>
  );
}
