import { useState, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '../lib/store-context'

const useLocation = () => {
  const [errMessage, setErrMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(StoreContext);
  const error = () => {
    setErrMessage('Unable to retrieve your location');
    setLoading(false);
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    dispatch({
      type: ACTION_TYPES.SET_LATLONG,
      payload: `${latitude},${longitude}`,
    });
    setLoading(false);
  };

  const getLocation = () => {
    dispatch({
      type: ACTION_TYPES.SET_LATLONG,
      payload: ``,
    });
    setErrMessage('');
    setLoading(true);
    if (!navigator.geolocation) {
      setErrMessage('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return { getLocation, loading, errMessage };
};

export default useLocation;
