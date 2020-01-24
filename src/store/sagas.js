import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';
import MeasurementsSaga from '../Features/Measurements/saga';

export default function* root() {
  yield spawn(weatherSaga);
  yield spawn(MeasurementsSaga);
}
