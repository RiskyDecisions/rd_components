const lowMidHigh = [
  { type: 'number', placeholder: 'Low' },
  { type: 'number', placeholder: 'Mid' },
  { type: 'number', placeholder: 'High' },
]

export const METHOD_VALUE_INPUT_MAP = {
  uniform: [
    { type: 'number', placeholder: 'value0', },
    { type: 'number', placeholder: 'value1', },
  ],
  algorithm: lowMidHigh,
  bernoulli: lowMidHigh,
  beta: lowMidHigh,
  binomial: lowMidHigh,
  buildup_exp: lowMidHigh,
  buildup_linear: lowMidHigh,
  constant: [
    { type: 'string', placeholder: 'Constant value'}
  ],
  decline_exp: lowMidHigh,
  decline_linear: lowMidHigh,
  exponential: lowMidHigh,
  function: [
    { type: 'string', placeholder: 'Function expression'}
  ],
  gamma: lowMidHigh,
  logistic: lowMidHigh,
  lognormal: lowMidHigh,
  lookup_table: lowMidHigh,
  normal: lowMidHigh,
  pareto: lowMidHigh,
  pert: lowMidHigh,
  rectangle: lowMidHigh,
  timefunction: lowMidHigh,
  timeseries: lowMidHigh
};
