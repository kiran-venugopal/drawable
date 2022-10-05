import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Dialog from '~/components/Dialog';
import { FileType } from '~/redux/filesSlice';
import { filesActions } from '~/redux/stores';
import { getLocalFilteContent } from '~/utils/canvas';
import CreateFile from '../CreateFile';
import './save-as-style.css';

function SaveAs() {
  const [isOpen, setIsOpen] = useState(false);
  const content = getLocalFilteContent();
  const dispatch = useDispatch();

  const toggleModal = () => setIsOpen((prev) => !prev);

  const handleSaveAsSuccess = (createdFile: FileType) => {
    toggleModal();

    dispatch(
      filesActions.setFiles({
        activeFile: createdFile.id,
      }),
    );

    window.localStorage.setItem('active_file', createdFile.id);
  };

  return (
    <div>
      <button onClick={toggleModal} className='link'>
        Save as
      </button>
      <Dialog isOpen={isOpen} onClose={toggleModal}>
        <div className='save-as'>
          <div className='title'>Save As</div>
          <CreateFile onSuccess={handleSaveAsSuccess} content={content} />
        </div>
      </Dialog>
    </div>
  );
}

export default SaveAs;
