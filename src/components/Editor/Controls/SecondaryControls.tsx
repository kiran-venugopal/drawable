import './control-style.css';
import DownloadIcon from '../../../icons/download.svg';
import DeleteIcon from '../../../icons/delete.svg';
import { ControlsPropsType } from './Controls';
import { useEffect, useState } from 'react';

function SecondaryControls({ editorState, canvas }: ControlsPropsType) {
  const [enableDelete, setEnableDelete] = useState(false);

  useEffect(() => {
    const handleSelectionCreate = () => {
      setEnableDelete(true);
    };

    const handleSelectionClear = () => {
      setEnableDelete(false);
    };

    canvas?.on('selection:created', handleSelectionCreate);
    canvas?.on('selection:cleared', handleSelectionClear);

    return () => {
      canvas?.off('selection:created', handleSelectionCreate);
      canvas?.off('selection:cleared', handleSelectionClear);
    };
  }, [canvas]);

  const handleDownloadClick = () => {
    const url =
      canvas?.toDataURL({
        format: 'jpeg',
        quality: 1,
      }) || '';
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'file.png';
    anchor.click();
    console.log({ url });
  };

  const handleDeleteIcon = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Delete' }));
  };

  return (
    <div className='secondary controls'>
      <button disabled={!enableDelete} onClick={handleDeleteIcon} className='control-item color'>
        <DeleteIcon />
      </button>
      <button onClick={handleDownloadClick} className='control-item color'>
        <DownloadIcon />
      </button>
    </div>
  );
}

export default SecondaryControls;
