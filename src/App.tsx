import Editor from './components/Editor';
import './App.css';
import Navbar from './components/Navbar';
import { Provider } from 'react-redux';
import store from './redux/stores';

function App() {
  return (
    <Provider store={store}>
      <div className='app'>
        <Navbar />
        <Editor />
      </div>
    </Provider>
  );
}

export default App;
