import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, Query, createClient, useQuery } from 'urql';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';
import ReactEcharts from 'echarts-for-react';
import Card from '@material-ui/core/Card';
import isEmpty from 'lodash.isempty';
import get from 'lodash.get';
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import SelectMetrics from './SelectMetrics';
import { actions } from './reducer';

const useStyles = makeStyles({
  wrapper: {
    padding: 24,
  },
  cardList: {
    display: 'flex',
    alignItems: 'center',
    margin: -4,
    padding: '24px 0',
  },
  card: {
    margin: 4,
    width: 200,
    padding: 16,
  },
  cardTitle: {
    margin: '0 0 8px',
  },
  cardValue: {
    margin: 0,
  },
  loader: {
    margin: 4,
  },
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const Measurements = () => {
  const classes = useStyles();
  const [metrics, setMetrics] = useState(['waterTemp']);
  const dispatch = useDispatch();
  const measurementsMap = useSelector(state => state.measurements.byMetricName);

  const option = {
    title: {
      text: 'Measurements',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        showMinLabel: false,
        showMaxLabel: false,
        formatter: value => moment(value).format('hh:mm a'),
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: 'F',
      min: value => value.min - 20,
      max: value => value.max + 20,
      axisLabel: {
        showMinLabel: false,
        showMaxLabel: false,
      },
      splitLine: {
        show: false,
      },
    },
    series: metrics.map(metricName => ({
      type: 'line',
      name: metricName,
      showSymbol: false,
      hoverAnimation: false,
      data: get(measurementsMap, metricName, [])
        .slice(-3000)
        .map(item => ({
          name: new Date(item.at),
          value: [new Date(item.at), item.value],
        })),
    })),
  };

  const renderMetricCard = (metricName, measurements) => (
    <Card className={classes.card}>
      <h4 className={classes.cardTitle}>{metricName}</h4>
      <h2 className={classes.cardValue}>{measurements[measurements.length - 1].value}</h2>
    </Card>
  );

  return (
    <Provider value={client}>
      <div className={classes.wrapper}>
        <SelectMetrics
          value={metrics.map(metric => ({ label: metric, value: metric }))}
          onChange={metricOptions => setMetrics(metricOptions.map(({ value }) => value))}
        />
        <div className={classes.cardList}>
          {metrics.map(metricName => {
            const measurements = measurementsMap[metricName];

            if (isEmpty(measurements)) {
              return (
                <Query
                  query={`
                    query($input: MeasurementQuery!) {
                      getMeasurements(input: $input) {
                        metric
                        at
                        value
                        unit
                      }
                    }
                  `}
                  variables={{ input: { metricName } }}
                >
                  {({ fetching, data, error, extensions }) => {
                    if (fetching) {
                      return <CircularProgress className={classes.loader} />;
                    }
                    if (error) {
                      dispatch(actions.measurementsApiErrorReceived(error));
                      return;
                    }
                    dispatch(actions.measurementsRecevied(data.getMeasurements));
                    return renderMetricCard(metricName, data.getMeasurements);
                  }}
                </Query>
              );
            }
            return renderMetricCard(metricName, measurements);
          })}
        </div>
        <ReactEcharts
          notMerge
          lazyUpdate
          style={{ height: '100vh', width: '100%' }}
          option={option}
        />
      </div>
    </Provider>
  );
};

export default Measurements;
