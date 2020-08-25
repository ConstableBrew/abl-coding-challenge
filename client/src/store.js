import {createStore} from 'redux';
import {createRootReducer} from './createRootReducer';

export const store = createStore(createRootReducer());
