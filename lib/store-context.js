import { createContext, useReducer } from 'react';

export const StoreContext = createContext();
export const ACTION_TYPES = {
  SET_LATLONG: 'SET_LATLONG',
  SET_STORES: 'SET_STORES',
  SET_STORE: 'SET_STORE'
};

const StoreProvider = ({ children }) => {
  const initialState = {
    latlong: '',
    stores: []
  };

  const storeReducer = (state, action) => {
    switch (action.type) {
      case ACTION_TYPES.SET_LATLONG:
        return { ...state, latlong: action.payload };
      case ACTION_TYPES.SET_STORES:
        return { ...state, stores: action.payload };
      default:
        throw new Error(`unhandled action type: ${action.type}`);
    }
  };
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
