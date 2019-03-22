const lowMidHigh = [
  { type: 'number', placeholder: 'Low' },
  { type: 'number', placeholder: 'Mid' },
  { type: 'number', placeholder: 'High' },
]

const uniform = [
  { type: 'number', placeholder: 'Min.', },
  { type: 'number', placeholder: 'Max.', },
]

export const METHOD_VALUE_INPUT_MAP = {
  uniform: uniform,
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
  timeseries: lowMidHigh,
  uniform_discrete: uniform,
};
