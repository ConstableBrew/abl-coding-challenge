import {createStore} from 'redux';
import {createRootReducer} from './createRootReducer';

const configureStore = () => {
    const store = createStore(
        createRootReducer(),
    );

    return store;
};

export default configureStore;
