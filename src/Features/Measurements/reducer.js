import { createSlice } from 'redux-starter-kit';

const initialState = {
  byMetricName: {},
};

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    measurementsRecevied: (state, action) => {
      const { metric } = action.payload[0];
      state.byMetricName[metric] = action.payload;
    },
    measurementsApiErrorReceived: (state, action) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
