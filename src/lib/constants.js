export const TYPE_METHOD_MAP = {
  'variable': {
    "Discrete Distributions": [
      {
        "name": "Constant",
        "value": "constant"
      },
      {
        "name": "Binomial",
        "value": "binomial"
      }
    ],
    "Continuous Distributions": [
      {
        "name": "Normal",
        "value": "normal"
      },
      {
        "name": "Lognormal",
        "value": "lognormal"
      },
      {
        "name": "Pert",
        "value": "pert"
      },
      {
        "name": "Uniform",
        "value": "uniform"
      },
      {
        "name": "Beta",
        "value": "beta"
      },
      {
        "name": "Gamma",
        "value": "gamma"
      },
      {
        "name": "Exponential",
        "value": "exponential"
      },
      {
        "name": "Logistic",
        "value": "logistic"
      },
      {
        "name": "Pareto",
        "value": "pareto"
      }
    ],
    "Functions": [
      {
        "name": "Exact Function",
        "value": "function"
      },
      {
        "name": "Algorithm (with uncertainty on the expression itself)",
        "value": "algorithm"
      }
    ]
  },
  'timeseries': {
    'Profiles':
      [
        {
          "value": 'rectangle',
          "name": 'Rectangle',
        },
        {
          "value": 'timeseries',
          "name": 'Timeseries',
        },
        {
          "value": 'timefunction',
          "name": 'Timefunction',
        },
      ]
  }
}
