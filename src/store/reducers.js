import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as measurementsReducer } from '../Features/Measurements/reducer';

export default {
  weather: weatherReducer,
  measurements: measurementsReducer,
};
