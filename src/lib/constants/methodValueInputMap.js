const bernoulli = [{
  type: 'number',
  placeholder: 'Probability',
  dataBalloon: 'Probability (between 0 and 1)',
  dataBalloonPos: 'up',
  min: 0,
  max: 0,
  step: 0.001
}]
const constant = [{ type: 'string', placeholder: 'Constant value', dataBalloon: 'Constant', dataBalloonPos: 'up' }]
const func = [{
  type: 'string',
  placeholder: 'Function expression',
  dataBalloon: 'Function expression',
  dataBalloonPos: 'up'
}]
const lowMidHigh = [
  { type: 'number', placeholder: 'Low', dataBalloon: 'Low', dataBalloonPos: 'up' },
  { type: 'number', placeholder: 'Mid', dataBalloon: 'Mid', dataBalloonPos: 'up' },
  { type: 'number', placeholder: 'High', dataBalloon: 'High', dataBalloonPos: 'up' },
]

const uniform = [
  { type: 'number', placeholder: 'Min.', dataBalloon: 'Minimum', dataBalloonPos: 'up' },
  { type: 'number', placeholder: 'Max.', dataBalloon: 'Maxium', dataBalloonPos: 'up' },
]

const rectangle = [
  { type: 'text', placeholder: 'Total', dataBalloon: 'Total', dataBalloonPos: 'up' },
  { type: 'text', placeholder: 'Duration', dataBalloon: 'Duration', dataBalloonPos: 'up' },
  { type: 'text', placeholder: 'Start', dataBalloon: 'Start', dataBalloonPos: 'up' },
]

const triangle = [
  { type: 'text', placeholder: 'Total', dataBalloon: 'Total', dataBalloonPos: 'up' },
  { type: 'text', placeholder: 'Duration', dataBalloon: 'Duration', dataBalloonPos: 'up' },
  { type: 'text', placeholder: 'Start', dataBalloon: 'Start', dataBalloonPos: 'up' },
  { type: 'text', placeholder: 'Peak', dataBalloon: 'Peak', dataBalloonPos: 'up' },
]

const discountTimeseries = [
  { type: 'text', placeholder: 'Input Timeseries', dataBalloon: 'Another timeseries as input', dataBalloonPos: 'up' },
  { type: 'text', placeholder: 'Discount factor', dataBalloon: 'Number or distribution', dataBalloonPos: 'up' },
]

const sumTimeseries = [
  { type: 'text', placeholder: 'Input Timeseries', dataBalloon: 'Another timeseries as input', dataBalloonPos: 'up' },
]

export const METHOD_VALUE_INPUT_MAP = {
  algorithm: lowMidHigh,
  bernoulli: bernoulli,
  beta: lowMidHigh,
  binomial: lowMidHigh,
  buildup_exp: lowMidHigh,
  buildup_linear: lowMidHigh,
  constant: constant,
  decline_exp: lowMidHigh,
  decline_linear: lowMidHigh,
  discount: discountTimeseries,
  exponential: lowMidHigh,
  function: func,
  gamma: lowMidHigh,
  logistic: lowMidHigh,
  lognormal: lowMidHigh,
  lookup_table: lowMidHigh,
  normal: lowMidHigh,
  pareto: lowMidHigh,
  pert: lowMidHigh,
  rectangle: rectangle,
  sumTimeseries: sumTimeseries,
  timefunction: lowMidHigh,
  timeseries: lowMidHigh,
  triangle: triangle,
  uniform: uniform,
  uniform_discrete: uniform,
};
