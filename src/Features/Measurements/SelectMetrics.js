import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import { useQuery } from 'urql';
import get from 'lodash.get';

const SelectMetrics = ({ value, onChange }) => {
  const [result] = useQuery({
    query: `
      query {
        getMetrics
      }
    `,
  });
  const { fetching, data, error } = result;
  const options = get(data, 'getMetrics', []).map(metric => ({
    label: metric,
    value: metric,
  }));

  return (
    <ReactSelect isMulti isLoading={fetching} value={value} onChange={onChange} options={options} />
  );
};

SelectMetrics.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SelectMetrics;
