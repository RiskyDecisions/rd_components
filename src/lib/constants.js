export const TYPE_METHOD_MAP = {
  riskVariable: {
    "Continuous Distributions": [
      {
        name: "Risked Normal",
        value: "normal"
      },
      {
        name: "Risked Lognormal",
        value: "lognormal"
      },
      {
        name: "Risked Pert",
        value: "pert"
      },
      {
        name: "Risked Uniform",
        value: "uniform"
      },
      {
        name: "Risked Beta",
        value: "beta"
      },
      {
        name: "Risked Gamma",
        value: "gamma"
      },
      {
        name: "Risked Exponential",
        value: "exponential"
      },
      {
        name: "Risked Logistic",
        value: "logistic"
      },
      {
        name: "Risked Pareto",
        value: "pareto"
      }
    ],
    "Discrete Distributions": [
      {
        name: "Risked Constant",
        value: "constant"
      },
      {
        name: "Risked Binomial",
        value: "binomial"
      },
      {
        name: "Risked Bernoulli",
        value: "bernoulli"
      }
    ],
    Functions: [
      {
        name: "Risked Exact Function",
        value: "function"
      },
      {
        name: "Risked Algorithm (with uncertainty on the expression itself)",
        value: "algorithm"
      }
    ]
  },
  timeseries: {
    Profiles: [
      {
        name: "Rectangle",
        value: "rectangle"
      },
      {
        name: "Timeseries",
        value: "timeseries"
      },
      {
        name: "Timefunction",
        value: "timefunction"
      },
      {
        name: "Linear build-up",
        value: "buildup_linear"
      },
      {
        name: "Exponential build-up",
        value: "buildup_exp"
      },
      {
        name: "Linear decline/dropoff",
        value: "decline_linear"
      },
      {
        name: "Exponential decline/dropoff",
        value: "decline_exp"
      },
      {
        name: "Look-up table",
        value: "lookup_table"
      }
    ]
  },
  variable: {
    "Continuous Distributions": [
      {
        name: "Normal",
        value: "normal"
      },
      {
        name: "Lognormal",
        value: "lognormal"
      },
      {
        name: "Pert",
        value: "pert"
      },
      {
        name: "Uniform",
        value: "uniform"
      },
      {
        name: "Beta",
        value: "beta"
      },
      {
        name: "Gamma",
        value: "gamma"
      },
      {
        name: "Exponential",
        value: "exponential"
      },
      {
        name: "Logistic",
        value: "logistic"
      },
      {
        name: "Pareto",
        value: "pareto"
      }
    ],
    "Discrete Distributions": [
      {
        name: "Constant",
        value: "constant"
      },
      {
        name: "Binomial",
        value: "binomial"
      },
      {
        name: "Bernoulli",
        value: "bernoulli"
      }
    ],
    Functions: [
      {
        name: "Exact Function",
        value: "function"
      },
      {
        name: "Algorithm (with uncertainty on the expression itself)",
        value: "algorithm"
      }
    ]
  }
}
