
import {Provider} from 'react-redux' 
import {store, persistor} from '@/redux/Store';
import App from './App';
import {PersistGate} from 'redux-persist/es/integration/react';
import LoaderComponent from '@/Components/LoaderComponent';

export default function Index() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading ={<LoaderComponent/>}
        persistor ={persistor}
      >
           <App/>
        </PersistGate>
    </Provider>
  );
}
