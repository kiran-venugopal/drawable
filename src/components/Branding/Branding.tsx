import Logo from '../../icons/logo.svg';
import './branding-style.css';

function Branding() {
  return (
    <div className='branding'>
      <Logo />
      <div className='app-name'>Drawable</div>
    </div>
  );
}

export default Branding;
