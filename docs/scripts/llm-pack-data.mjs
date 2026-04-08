export const generatedAt = new Date().toISOString().slice(0, 10);

export const styles = [
  {
    slug: "toast",
    title: "Toast Style",
    summary: "Pastel palette, soft motion, and strong out-of-the-box defaults.",
    useWhen:
      "Use when the prompt wants something expressive, product-facing, or presentation-friendly without writing a custom renderer first.",
    strengths: [
      "Good default title, legend, and animation behavior",
      "Easy first pass for most dashboard and marketing charts",
      "Strong preset surface in shared/chart-presets",
    ],
    sourcePaths: [
      "shared/chart-presets/styles/toast",
      "shared/chart-presets/charts/*/styles/toast",
    ],
  },
  {
    slug: "ag",
    title: "AG Style",
    summary: "Muted business dashboard look with restrained motion and denser layout.",
    useWhen:
      "Use when the request sounds operational, enterprise, financial, or needs a calmer presentation surface.",
    strengths: [
      "Better fit for business dashboards and dense comparison views",
      "More conservative defaults for titles, legend, and grid",
      "Useful when the user says AG-like, dashboard, or analyst-facing",
    ],
    sourcePaths: [
      "shared/chart-presets/styles/ag",
      "shared/chart-presets/charts/*/styles/ag",
    ],
  },
];

function chart(definition) {
  return definition;
}

export const chartFamilies = [
  chart({
    slug: "bar-chart",
    title: "Bar Chart",
    importName: "BarChart",
    category: "cartesian",
    surface: "preset",
    supportedStyles: ["toast", "ag"],
    supportsStyleArg: true,
    summary: "Compare discrete categories with grouped or directional bars.",
    useWhen: [
      "The x domain is categorical rather than continuous",
      "The user wants direct comparison between categories or cohorts",
      "Negative values or horizontal orientation might matter",
    ],
    avoidWhen: [
      "The main story is trend over continuous time",
      "The main story is part-to-whole at one moment",
    ],
    askBeforeCoding: [
      "Should the chart be vertical or horizontal?",
      "Is the comparison grouped or should it actually be stacked?",
      "Do negative values or diverging bars need special treatment?",
    ],
    implementationNotes: [
      "Start with chart-presets BarChart and only drop to headless when layout or bar rendering stops fitting.",
      "Prefer toast for expressive product UI; switch to ag for analyst dashboards.",
      "If the request asks for custom bar shapes, threshold markers, or label logic, use the custom slot surface before rewriting the chart.",
    ],
    overrideSurface: [
      "bar: draw a fully custom bar body",
      "barBox: control size and reveal behavior",
      "barGroup: control grouping layout inside each category",
      "grid / xAxis / yAxis: tune the structural shell without rewriting the controller",
    ],
    escapeHatch:
      "Go headless if categories need non-standard spatial layout, mixed chart layers, or custom interactions that no longer map cleanly to grouped bars.",
    dataShape: `{
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [
    { legend: "Revenue", values: [42, 58, 49, 73] },
    { legend: "Cost", values: [30, 35, 38, 46] }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/bar-chart",
      "packages/chart/src/headless/bar-chart",
      "docs/src/app/chart/_data/bar-chart",
    ],
    evaluation: {
      title: "Regional revenue with negatives and orientation choice",
      prompt:
        "Build a chart comparing monthly revenue delta across North America, Europe, and APAC for Jan to Jun. Some categories are negative and the PM is not sure whether horizontal or vertical reads better.",
      mustAsk: [
        "Should the chart be horizontal or vertical?",
        "Should negatives diverge around zero with explicit zero line treatment?",
      ],
      successCriteria: [
        "Chooses grouped bar instead of stacked or line",
        "Uses preset config first and only escalates if the user asks for unusual bar rendering",
        "Flags the orientation ambiguity before coding blindly",
      ],
      criticFocus: [
        "Did the reader confuse grouped bar with stacked bar?",
        "Did it invent unsupported preset APIs?",
        "Did it skip the negative-value handling question?",
      ],
    },
  }),
  chart({
    slug: "stacked-bar-chart",
    title: "Stacked Bar Chart",
    importName: "StackedBarChart",
    category: "cartesian",
    surface: "preset",
    supportedStyles: ["toast", "ag"],
    supportsStyleArg: true,
    summary: "Compare totals while preserving contribution by series inside each category.",
    useWhen: [
      "The prompt is part-to-whole across categories",
      "Total height and segment contribution both matter",
      "The user explicitly says stacked, composition, or contribution",
    ],
    avoidWhen: [
      "Series-to-series comparison must stay easy across categories",
      "The stack should be normalized to 100% and current preset logic is not enough",
    ],
    askBeforeCoding: [
      "Should this be absolute stacked or percent stacked?",
      "Does series order carry meaning and need to stay fixed?",
      "Do negative values exist, and if so should they diverge around zero?",
    ],
    implementationNotes: [
      "Use chart-presets StackedBarChart first.",
      "Choose ag when the chart is dense and mostly analytical.",
      "If segment labeling or stack math gets custom, check the advanced surface before moving to headless.",
    ],
    overrideSurface: [
      "barGroup: own the stack layout for each category",
      "bar: customize each stacked segment",
      "dataLabel: place contribution labels selectively",
      "legend: add filtering or explanatory affordances",
    ],
    escapeHatch:
      "Go headless if the request needs normalized stacks, waterfall-like transitions, or hybrid overlays on top of the stack.",
    dataShape: `{
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    { legend: "Product", values: [24, 28, 31, 36] },
    { legend: "Services", values: [11, 14, 15, 18] },
    { legend: "Support", values: [4, 5, 6, 7] }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/stacked-bar-chart",
      "packages/chart/src/headless/bar-chart",
      "docs/src/app/chart/_data/stacked-bar-chart",
    ],
    evaluation: {
      title: "Contribution by business line across quarters",
      prompt:
        "Show quarterly revenue as one total per quarter, but make the contribution of Product, Services, and Support visible inside each bar.",
      mustAsk: [
        "Is this absolute stacked or 100% stacked?",
        "Does the series order carry semantic meaning?",
      ],
      successCriteria: [
        "Chooses stacked bar instead of grouped bar",
        "Calls out percent-stack ambiguity if not specified",
        "Keeps the solution in chart-presets unless stack semantics become custom",
      ],
      criticFocus: [
        "Did the reader default to grouped bars?",
        "Did it ignore the percent-stack question?",
      ],
    },
  }),
  chart({
    slug: "line-chart",
    title: "Line Chart",
    importName: "LineChart",
    category: "cartesian",
    surface: "preset",
    supportedStyles: ["toast", "ag"],
    supportsStyleArg: true,
    summary: "Show continuous trends, comparisons over time, and line-based overlays.",
    useWhen: [
      "The main signal is trend over ordered labels or time",
      "The prompt mentions trend, trajectory, baseline, or moving line",
      "Multiple datasets should remain easy to compare point-by-point",
    ],
    avoidWhen: [
      "Filled magnitude is more important than the line itself",
      "The request is actually scatter or bubble because both axes are numeric",
    ],
    askBeforeCoding: [
      "Should points, labels, or tooltips show every sample or only key markers?",
      "Does the user expect smoothing or straight segments?",
      "Is an overlay line enough, or does the prompt really want area or combo behavior?",
    ],
    implementationNotes: [
      "Use chart-presets LineChart first.",
      "Stay in preset mode when the request is standard line comparison with config-level changes.",
      "If the user wants bands, thresholds, or bespoke point rendering, push those through custom slots before rewriting the whole chart.",
    ],
    overrideSurface: [
      "line: draw each dataset path",
      "dataView: wrap and order lines together",
      "dataLabel: selectively annotate points",
      "xAxis / yAxis / grid: align the chart with dashboard conventions",
    ],
    escapeHatch:
      "Go headless if the chart becomes a composed line system with custom point logic, confidence intervals, or non-standard hover behavior.",
    dataShape: `{
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    { legend: "Signups", values: [18, 24, 21, 29, 33] },
    { legend: "Trials", values: [12, 16, 15, 20, 25] }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/line-chart",
      "packages/chart/src/headless/line-chart",
      "docs/src/app/chart/_data/line-chart",
    ],
    evaluation: {
      title: "Lead and activation trend comparison",
      prompt:
        "Plot weekly leads and activations so product can compare trajectory and divergence over the last eight weeks.",
      mustAsk: [
        "Do labels or point markers need to appear on every sample?",
        "Is smoothing expected or should segments stay literal?",
      ],
      successCriteria: [
        "Chooses line rather than scatter or area by default",
        "Keeps the plan in preset land unless custom overlays are requested",
        "Explains what would force a combo or area chart instead",
      ],
      criticFocus: [
        "Did the reader miss the line-vs-area tradeoff?",
        "Did it invent custom smoothing APIs?",
      ],
    },
  }),
  chart({
    slug: "area-chart",
    title: "Area Chart",
    importName: "AreaChart",
    category: "cartesian",
    surface: "preset",
    supportedStyles: ["toast", "ag"],
    supportsStyleArg: true,
    summary: "Trend chart where filled magnitude and cumulative visual weight matter.",
    useWhen: [
      "The user wants trend plus sense of magnitude",
      "One or two series should feel softer or more atmospheric than a plain line chart",
      "The prompt references filled area, coverage, or volume over time",
    ],
    avoidWhen: [
      "Too many overlapping series would make the fill unreadable",
      "The user mainly wants exact comparison across many categories",
    ],
    askBeforeCoding: [
      "Should the area be overlapped or is this really stacked-area?",
      "Does opacity need to preserve comparison between multiple fills?",
      "Are point markers or thresholds required on top of the area?",
    ],
    implementationNotes: [
      "Use chart-presets AreaChart for standard filled trend requests.",
      "Toast is usually the best first pass because the softer visual language fits area charts well.",
      "If overlays or focus interactions are heavy, consider headless composition after using slots.",
    ],
    overrideSurface: [
      "area: draw the filled region and optional stroke",
      "dataView: order area layers and labels",
      "dataLabel: emphasize peaks or endpoints only",
      "grid / axes: tune readability for dense fills",
    ],
    escapeHatch:
      "Go headless if the chart needs custom bands, mixed line-area layering, or annotation systems that exceed the preset surface.",
    dataShape: `{
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    { legend: "Traffic", values: [120, 148, 142, 176, 190] },
    { legend: "Activated", values: [82, 96, 101, 118, 130] }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/area-chart",
      "packages/chart/src/headless/line-chart",
      "docs/src/app/chart/_data/area-chart",
    ],
    evaluation: {
      title: "Trend plus magnitude without overfitting to a line",
      prompt:
        "We need a chart for weekly traffic and activated users. The VP wants the trend to feel substantial, not just thin lines, but still needs to compare both series over time.",
      mustAsk: [
        "Is filled magnitude more important than crisp line comparison?",
        "Should this be area or line with one series emphasized?",
      ],
      successCriteria: [
        "Frames area vs line as a deliberate choice instead of guessing",
        "Keeps the solution in preset space unless overlays or custom bands are requested",
        "Names what additional information would force a different chart family",
      ],
      criticFocus: [
        "Did the reader pick a chart family too early without explaining the tradeoff?",
        "Did it miss that the prompt values both trend and magnitude?",
      ],
    },
  }),
  chart({
    slug: "stacked-area-chart",
    title: "Stacked Area Chart",
    importName: "StackedAreaChart",
    category: "cartesian",
    surface: "preset",
    supportedStyles: ["toast", "ag"],
    supportsStyleArg: true,
    summary: "Show total trend over time while preserving how each series contributes.",
    useWhen: [
      "The prompt is part-to-whole over time",
      "The user wants total trajectory and composition in one view",
      "The request mentions stacked trend or layered cumulative area",
    ],
    avoidWhen: [
      "Series comparison at each point is more important than total composition",
      "A normalized 100% stack is required and the preset path is not enough",
    ],
    askBeforeCoding: [
      "Is this absolute stacked or normalized 100% stacked?",
      "Should smaller series stay visible even when buried inside the stack?",
      "Does the user need totals, contributions, or both labeled?",
    ],
    implementationNotes: [
      "Use chart-presets StackedAreaChart first.",
      "Ag works well for dense operational views; toast works well for presentation surfaces.",
      "Pay attention to series ordering because it changes readability and perception.",
    ],
    overrideSurface: [
      "area: customize each stacked band",
      "dataView: control stack ordering and wrappers",
      "legend: explain contribution order or visibility",
      "dataLabel: add totals or key contribution callouts",
    ],
    escapeHatch:
      "Go headless if you need percent stacking, mixed overlays, or novel stacking semantics not covered by the preset controller.",
    dataShape: `{
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    { legend: "Organic", values: [34, 38, 42, 46] },
    { legend: "Paid", values: [18, 21, 19, 24] },
    { legend: "Referral", values: [6, 8, 9, 11] }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/stacked-area-chart",
      "packages/chart/src/headless/line-chart",
      "docs/src/app/chart/_data/stacked-area-chart",
    ],
    evaluation: {
      title: "Acquisition composition over time",
      prompt:
        "Show the weekly total acquisition trend while preserving how Organic, Paid, and Referral contribute over time.",
      mustAsk: [
        "Is this absolute stacked or 100% stacked?",
        "Does the user need totals, contributions, or both labeled?",
      ],
      successCriteria: [
        "Chooses stacked area instead of overlapping area",
        "Calls out percent-stack ambiguity",
        "Uses preset surface before escalating",
      ],
      criticFocus: [
        "Did the reader confuse stacked area with overlapping area?",
        "Did it ignore the labeling question?",
      ],
    },
  }),
  chart({
    slug: "scatter-chart",
    title: "Scatter Chart",
    importName: "ScatterChart",
    category: "cartesian",
    surface: "preset",
    supportedStyles: ["toast", "ag"],
    supportsStyleArg: true,
    summary: "Plot correlation, spread, clusters, and outliers across two numeric axes.",
    useWhen: [
      "Both axes are numeric and point position matters",
      "The user wants correlation, clusters, or outliers",
      "Labels on individual points may matter more than a continuous series",
    ],
    avoidWhen: [
      "A trend line alone would answer the question",
      "A third numeric variable needs size encoding, which means bubble chart",
    ],
    askBeforeCoding: [
      "Should every point be labeled or only highlighted points?",
      "Is a trendline, regression, or quadrant annotation expected?",
      "Are the axes shared units, or do they need custom formatting?",
    ],
    implementationNotes: [
      "Use chart-presets ScatterChart first.",
      "Ag is often a better fit for dense analytical scatter plots.",
      "If points need custom hit areas, annotations, or overlays, use the custom scatter slot before changing chart architecture.",
    ],
    overrideSurface: [
      "scatter: draw each point body",
      "dataView: layer points and overlays together",
      "dataLabel: selectively annotate outliers",
      "grid / axes: adjust correlation readability",
    ],
    escapeHatch:
      "Go headless if the chart becomes a map-like plot, quadrant workspace, or mixed scatter-plus-annotation canvas.",
    dataShape: `{
  datasets: [
    {
      legend: "Series A",
      data: [
        { x: 12, y: 24, label: "A1" },
        { x: 18, y: 31, label: "A2" },
        { x: 30, y: 28, label: "A3" }
      ]
    }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/scatter-chart",
      "packages/chart/src/headless/scatter-chart",
      "docs/src/app/chart/_data/scatter-chart",
    ],
    evaluation: {
      title: "Correlation and outlier detection",
      prompt:
        "Plot marketing spend against pipeline generated for each campaign so we can see clusters and obvious outliers.",
      mustAsk: [
        "Do all points need labels or only outliers?",
        "Is a regression line or quadrant annotation required?",
      ],
      successCriteria: [
        "Chooses scatter rather than line",
        "Calls out point label density",
        "Keeps the plan in preset land unless overlays become custom",
      ],
      criticFocus: [
        "Did the reader accidentally treat the data as time series?",
        "Did it ignore label crowding?",
      ],
    },
  }),
  chart({
    slug: "bubble-chart",
    title: "Bubble Chart",
    importName: "BubbleChart",
    category: "cartesian",
    surface: "preset",
    supportedStyles: ["toast", "ag"],
    supportsStyleArg: true,
    summary: "Scatter chart with a third numeric value encoded by bubble size.",
    useWhen: [
      "The request includes x, y, and magnitude/value at once",
      "Relative point size is part of the story",
      "The user wants a portfolio, opportunity, or impact matrix",
    ],
    avoidWhen: [
      "The size encoding is decorative rather than meaningful",
      "Overlap becomes too high and the chart needs a different spatial strategy",
    ],
    askBeforeCoding: [
      "What exactly should bubble size encode?",
      "How should labels behave when bubbles overlap?",
      "Will overlap require jitter, transparency, or a different chart family?",
    ],
    implementationNotes: [
      "Use chart-presets BubbleChart first.",
      "Toast works well when the chart is presentation-heavy; ag works well for decision matrices.",
      "Bubble size semantics should be explained in title, legend, or hover copy if the prompt is ambiguous.",
    ],
    overrideSurface: [
      "bubble: draw the actual bubble body",
      "dataView: order bubbles and overlays",
      "dataLabel: handle selective labels for crowded charts",
      "legend: explain size encoding if required",
    ],
    escapeHatch:
      "Go headless if the plot needs collision management, complex labeling, or custom spatial annotations beyond the preset surface.",
    dataShape: `{
  datasets: [
    {
      legend: "Accounts",
      data: [
        { x: 18, y: 42, value: 240, label: "North" },
        { x: 30, y: 28, value: 160, label: "West" },
        { x: 44, y: 55, value: 320, label: "Enterprise" }
      ]
    }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/bubble-chart",
      "packages/chart/src/headless/bubble-chart",
      "docs/src/app/chart/_data/bubble-chart",
    ],
    evaluation: {
      title: "Three-variable opportunity matrix",
      prompt:
        "Plot opportunities by expected impact, implementation complexity, and pipeline value. Each opportunity should be individually readable and the bubble size should mean something real, not decoration.",
      mustAsk: [
        "What exactly should bubble size encode?",
        "How should labels behave when bubbles overlap?",
      ],
      successCriteria: [
        "Chooses bubble instead of plain scatter",
        "Calls out size semantics and overlap risk",
        "Uses preset first, then identifies overlap as a headless escape hatch if needed",
      ],
      criticFocus: [
        "Did the reader forget that size encoding needs explanation?",
        "Did it ignore label overlap risk?",
      ],
    },
  }),
  chart({
    slug: "pie-chart",
    title: "Pie Chart",
    importName: "PieChart",
    category: "polar",
    surface: "preset",
    supportedStyles: ["toast"],
    supportsStyleArg: false,
    summary: "Show simple part-to-whole breakdowns with a small number of slices.",
    useWhen: [
      "The prompt is a single composition snapshot",
      "The number of slices is modest and easy to label",
      "The user explicitly asks for pie or proportion slices",
    ],
    avoidWhen: [
      "There are too many categories or values are close together",
      "Comparison across multiple groups matters more than one composition",
    ],
    askBeforeCoding: [
      "How many slices will there be, and should tiny slices be grouped?",
      "Does the user want percentages, raw values, or both on labels?",
      "Would donut or stacked bar communicate the same story more clearly?",
    ],
    implementationNotes: [
      "Use chart-presets PieChart for straightforward composition views.",
      "There is only toast today, so custom visual direction usually starts by overriding slots rather than switching presets.",
      "Keep the slice count disciplined.",
    ],
    overrideSurface: [
      "slice: draw each arc segment",
      "dataView: control how slices are layered and wrapped",
      "legend: change label presentation or ordering",
      "title: explain denominator or context",
    ],
    escapeHatch:
      "Go headless if the prompt really wants a donut, polar area, radial progress, or a novel circular composition pattern.",
    dataShape: `{
  datasets: [
    { name: "Desktop", value: 42 },
    { name: "Mobile", value: 36 },
    { name: "Tablet", value: 22 }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/pie-chart",
      "packages/chart/src/headless/pie-chart",
      "docs/src/app/chart/_data/pie-chart",
    ],
    evaluation: {
      title: "Simple traffic share composition",
      prompt:
        "Show the share of traffic coming from Desktop, Mobile, and Tablet in a single composition snapshot.",
      mustAsk: [
        "Do we need percentages, raw values, or both?",
        "Are there enough slices that pie is still readable?",
      ],
      successCriteria: [
        "Chooses pie only for a small slice count",
        "Calls out label and slice-count constraints",
        "Stays inside preset surface unless composition becomes novel",
      ],
      criticFocus: [
        "Did the reader force pie on too many categories?",
        "Did it skip the label semantics question?",
      ],
    },
  }),
  chart({
    slug: "radar-chart",
    title: "Radar Chart",
    importName: "RadarChart",
    category: "polar",
    surface: "preset",
    supportedStyles: ["toast"],
    supportsStyleArg: false,
    summary: "Compare multivariate profiles across shared radial axes.",
    useWhen: [
      "The prompt compares profiles across repeated dimensions",
      "The user references capability, competency, balance, or spider-web comparisons",
      "Each dataset should share the same labeled axes around a center",
    ],
    avoidWhen: [
      "The dimensions are too many to read on radial axes",
      "Precise numeric comparison is more important than profile shape",
    ],
    askBeforeCoding: [
      "How many axes are there, and are their units genuinely comparable?",
      "Should the scale be fixed, derived, or explicitly provided?",
      "Does the chart need filled polygons, outline-only polygons, or highlighted vertices?",
    ],
    implementationNotes: [
      "Use chart-presets RadarChart when the request clearly maps to shared radial dimensions.",
      "There is only toast today, so novel visual direction usually means slot overrides.",
      "The scale choice changes interpretation; do not guess when the prompt hints at a fixed benchmark.",
    ],
    overrideSurface: [
      "radar: draw each dataset polygon",
      "angularAxisLabel: control category labeling",
      "radialAxisLabel: control scale labeling",
      "layout / plot: manage legends and profile density",
    ],
    escapeHatch:
      "Go headless if the chart needs custom radial geometry, non-polygon profiles, or heavy annotation logic.",
    dataShape: `{
  labels: ["Speed", "Quality", "Adoption", "Reliability", "Cost"],
  datasets: [
    { legend: "Current", values: [72, 81, 66, 88, 54] },
    { legend: "Target", values: [80, 84, 74, 92, 62] }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/radar-chart",
      "packages/chart/src/headless/radar-chart",
      "docs/src/app/chart/_data/radar-chart",
    ],
    evaluation: {
      title: "Capability profile comparison",
      prompt:
        "Compare the current capability profile of two products across Speed, Quality, Adoption, Reliability, and Cost.",
      mustAsk: [
        "Are the axes genuinely comparable on one shared scale?",
        "Should the scale be fixed or derived from the data?",
      ],
      successCriteria: [
        "Chooses radar only for shared profile dimensions",
        "Calls out scale choice",
        "Avoids pretending radar is good for exact comparison-heavy tasks",
      ],
      criticFocus: [
        "Did the reader ignore axis comparability?",
        "Did it oversell precision on a radar chart?",
      ],
    },
  }),
  chart({
    slug: "heatmap-chart",
    title: "Heatmap Chart",
    importName: "HeatmapChart",
    category: "matrix",
    surface: "preset",
    supportedStyles: ["toast"],
    supportsStyleArg: false,
    summary: "Show matrix patterns by mapping numeric intensity onto a cell grid.",
    useWhen: [
      "The prompt is naturally x by y matrix data",
      "The user wants pattern, concentration, seasonality, or occupancy",
      "A color scale communicates the story better than discrete marks",
    ],
    avoidWhen: [
      "Exact numeric comparison per cell matters more than pattern recognition",
      "The grid is sparse and another chart family would be clearer",
    ],
    askBeforeCoding: [
      "Should the color scale domain be fixed or derived from the data?",
      "Do cells need values, labels, or only hover detail?",
      "Are missing cells real zeros or truly missing data?",
    ],
    implementationNotes: [
      "Use chart-presets HeatmapChart first.",
      "Because only toast exists today, custom direction usually means slot overrides rather than preset switching.",
      "Always explain the scale and legend semantics if the prompt is not explicit.",
    ],
    overrideSurface: [
      "segment: draw each heatmap cell",
      "legend: customize the color scale explanation",
      "dataView: manage cell wrappers or overlays",
      "xAxis / yAxis: tighten labels for dense matrices",
    ],
    escapeHatch:
      "Go headless if the chart becomes a calendar grid, timetable, or matrix with rich cell widgets and custom interactions.",
    dataShape: `{
  xLabels: ["Jan", "Feb", "Mar", "Apr"],
  yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  values: [
    [4, 6, 9, 12],
    [3, 7, 10, 14],
    [2, 5, 8, 11],
    [4, 8, 12, 16],
    [5, 9, 13, 18]
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/heatmap-chart",
      "packages/chart/src/headless/heatmap-chart",
      "docs/src/app/chart/_data/heatmap-chart",
    ],
    evaluation: {
      title: "Support load matrix with scale ambiguity",
      prompt:
        "Make a support volume heatmap with weekday on the y-axis, hour bucket on the x-axis, and a color legend that operations can trust week over week.",
      mustAsk: [
        "Should the color scale be fixed across weeks or derived per dataset?",
        "Are missing cells true zeros or missing data?",
      ],
      successCriteria: [
        "Chooses heatmap quickly",
        "Flags the fixed-vs-derived legend scale question",
        "Does not hand-wave missing data semantics",
      ],
      criticFocus: [
        "Did the reader treat all empty cells as zero without asking?",
        "Did it forget that scale stability matters for weekly comparison?",
      ],
    },
  }),
  chart({
    slug: "box-plot-chart",
    title: "Box Plot Chart",
    importName: "BoxPlotChart",
    category: "distribution",
    surface: "base-wrapper",
    supportedStyles: [],
    supportsStyleArg: false,
    summary: "Show distribution through quartiles, whiskers, and optional outliers.",
    useWhen: [
      "The prompt is about spread, median, quartiles, and outliers",
      "Category-by-category distribution matters more than individual samples",
      "You need summary statistics rather than raw scatter points",
    ],
    avoidWhen: [
      "The user needs to see every underlying sample",
      "The story is mostly trend or composition rather than distribution",
    ],
    askBeforeCoding: [
      "Are quartiles already computed, or do we need to derive them upstream?",
      "Should outliers be shown, hidden, or annotated selectively?",
      "Is the chart vertical or horizontal?",
    ],
    implementationNotes: [
      "chart-presets BoxPlotChart gives structural defaults but not a branded preset system.",
      "Expect to own custom rendering sooner than with bar or line charts.",
      "Use the base wrapper first before dropping all the way to headless.",
    ],
    overrideSurface: [
      "boxPlot: draw the box, median, and whiskers",
      "outlier: control how point outliers appear",
      "boxPlotGroup: manage grouped-category layout",
      "axes / grid / layout: keep statistical context readable",
    ],
    escapeHatch:
      "Go headless if the distribution logic itself, orientation rules, or custom interaction model exceed the base wrapper.",
    dataShape: `{
  labels: ["Control", "Experiment"],
  datasets: [
    {
      legend: "Latency",
      data: [
        { min: 72, q1: 88, median: 96, q3: 112, max: 140, outliers: [156] },
        { min: 60, q1: 74, median: 85, q3: 99, max: 120, outliers: [132, 138] }
      ]
    }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/box-plot-chart",
      "packages/chart/src/headless/box-plot-chart",
    ],
    evaluation: {
      title: "Distribution comparison by cohort",
      prompt:
        "Compare response-time distribution for the Control and Experiment cohorts, including median, quartiles, and visible outliers.",
      mustAsk: [
        "Are quartiles precomputed or should they be derived upstream?",
        "Should outliers be visible and labeled?",
      ],
      successCriteria: [
        "Chooses box plot instead of bar or line",
        "Recognizes this is a base-wrapper chart, not a branded preset path",
        "Calls out outlier visibility and statistical input assumptions",
      ],
      criticFocus: [
        "Did the reader confuse distribution summaries with raw samples?",
        "Did it pretend there was a toast/ag preset for box plots?",
      ],
    },
  }),
  chart({
    slug: "candlestick-chart",
    title: "Candlestick Chart",
    importName: "CandlestickChart",
    category: "financial",
    surface: "base-wrapper",
    supportedStyles: [],
    supportsStyleArg: false,
    summary: "Represent open-high-low-close movement for each interval.",
    useWhen: [
      "The prompt contains OHLC data",
      "The story is interval-level price movement rather than simple totals",
      "High/low spread matters, not just close values",
    ],
    avoidWhen: [
      "The user only has one value per interval",
      "A standard line chart is enough to communicate the trend",
    ],
    askBeforeCoding: [
      "What is the aggregation interval: minute, hour, day, or something else?",
      "Should bullish/bearish colors follow a specific convention?",
      "Do we need volume, moving averages, or overlays, which may turn this into a combo chart?",
    ],
    implementationNotes: [
      "chart-presets CandlestickChart gives a base structural wrapper.",
      "Treat color semantics and interval labeling as first-class questions.",
      "Use combo only if the request adds extra layers like moving averages or volume bars.",
    ],
    overrideSurface: [
      "candlestick: own wick/body appearance",
      "dataView: control grouping and overlays",
      "dataLabel: annotate unusual intervals only",
      "axes / grid: tune finance-style readability",
    ],
    escapeHatch:
      "Go headless if financial overlays, custom scales, or bespoke interaction rules exceed the base wrapper.",
    dataShape: `{
  labels: ["Mon", "Tue", "Wed", "Thu"],
  datasets: [
    {
      legend: "AAPL",
      data: [
        { open: 182, high: 188, low: 179, close: 186 },
        { open: 186, high: 191, low: 184, close: 185 },
        { open: 185, high: 189, low: 180, close: 183 },
        { open: 183, high: 187, low: 181, close: 186 }
      ]
    }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/candlestick-chart",
      "packages/chart/src/headless/candlestick-chart",
    ],
    evaluation: {
      title: "OHLC price movement by day",
      prompt:
        "Render daily OHLC movement for one stock and make sure rising and falling sessions are visually distinct.",
      mustAsk: [
        "What interval are we charting?",
        "What bullish/bearish color convention should be used?",
      ],
      successCriteria: [
        "Chooses candlestick instead of line",
        "Treats finance semantics as primary",
        "Does not pretend a fully themed preset exists",
      ],
      criticFocus: [
        "Did the reader reduce OHLC to a single-value line?",
        "Did it skip color convention questions?",
      ],
    },
  }),
  chart({
    slug: "donut-chart",
    title: "Donut Chart",
    importName: "DonutChart",
    category: "polar",
    surface: "base-wrapper",
    supportedStyles: [],
    supportsStyleArg: false,
    summary: "Part-to-whole chart with center content and an inner radius.",
    useWhen: [
      "The prompt is pie-like but needs center content",
      "A KPI or summary belongs in the middle of the chart",
      "Part-to-whole still matters more than exact comparison",
    ],
    avoidWhen: [
      "There are too many slices for radial labeling",
      "The center content is doing too much and the chart is becoming a scorecard",
    ],
    askBeforeCoding: [
      "What should appear in the center: total, label, KPI, or custom widget?",
      "How many slices are there, and do tiny slices need grouping?",
      "Would pie or progress communicate the story more cleanly?",
    ],
    implementationNotes: [
      "chart-presets DonutChart already reuses pie-style defaults, including a center-content slot.",
      "Treat donut as composition plus summary, not only as a decorative pie variant.",
      "If the center becomes interactive or highly custom, you may need to leave the base wrapper.",
    ],
    overrideSurface: [
      "slice: customize arc rendering",
      "centerContent: own the center summary widget",
      "legend / title: clarify denominator and ordering",
      "dataView: manage arc-plus-center composition",
    ],
    escapeHatch:
      "Go headless if the center content becomes a true composite experience or the arc behavior stops resembling a donut chart.",
    dataShape: `{
  datasets: [
    { name: "Completed", value: 64 },
    { name: "In Progress", value: 24 },
    { name: "Blocked", value: 12 }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/donut-chart",
      "packages/chart/src/headless/donut-chart",
    ],
    evaluation: {
      title: "Completion split with center KPI",
      prompt:
        "Show Completed, In Progress, and Blocked as a donut with the total number of tasks in the center.",
      mustAsk: [
        "What exactly should the center content show?",
        "Are there enough slices that a donut remains readable?",
      ],
      successCriteria: [
        "Chooses donut instead of plain pie because center content matters",
        "Uses the centerContent slot explicitly",
        "Keeps the chart in the base wrapper unless center behavior becomes composite",
      ],
      criticFocus: [
        "Did the reader ignore the center-content requirement?",
        "Did it overcomplicate a simple donut request?",
      ],
    },
  }),
  chart({
    slug: "funnel-chart",
    title: "Funnel Chart",
    importName: "FunnelChart",
    category: "staged",
    surface: "base-wrapper",
    supportedStyles: [],
    supportsStyleArg: false,
    summary: "Show sequential stage dropoff and conversion through a funnel.",
    useWhen: [
      "The prompt is stage-by-stage attrition or conversion",
      "Order is fixed and meaningful",
      "Relative drop between stages matters more than precise axis comparison",
    ],
    avoidWhen: [
      "Stages are not sequential",
      "A sankey or waterfall would better explain branching or cumulative change",
    ],
    askBeforeCoding: [
      "Is stage order fixed?",
      "Should values show raw counts, percentages, or both?",
      "Does the chart need stage-to-stage conversion labels?",
    ],
    implementationNotes: [
      "Use chart-presets FunnelChart as a base wrapper.",
      "Clarify whether this is raw-stage volume, conversion, or both.",
      "Branching flows are not funnel charts; use sankey instead.",
    ],
    overrideSurface: [
      "stage: own segment geometry and labels",
      "stageLabel / dataLabel: explain conversion semantics",
      "legend: reinforce stage meaning if colors carry semantics",
      "layout: reshape the chart for a more product or dashboard tone",
    ],
    escapeHatch:
      "Go headless if the funnel needs novel geometry, interactive stage expansion, or hybrid scorecard behavior.",
    dataShape: `{
  stages: [
    { label: "Visited", value: 12000 },
    { label: "Signed Up", value: 4800 },
    { label: "Activated", value: 2100 },
    { label: "Paid", value: 840 }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/funnel-chart",
      "packages/chart/src/headless/funnel-chart",
    ],
    evaluation: {
      title: "Signup conversion funnel",
      prompt:
        "Show the drop from Visited to Signed Up to Activated to Paid. The PM wants to see where the biggest conversion loss happens.",
      mustAsk: [
        "Should the chart show raw counts, percentages, or both?",
        "Is stage order fixed and authoritative?",
      ],
      successCriteria: [
        "Chooses funnel rather than sankey or bar",
        "Treats stage ordering as fixed",
        "Calls out conversion labeling needs",
      ],
      criticFocus: [
        "Did the reader confuse staged dropoff with branching flow?",
        "Did it ignore raw-vs-percent labeling?",
      ],
    },
  }),
  chart({
    slug: "histogram-chart",
    title: "Histogram Chart",
    importName: "HistogramChart",
    category: "distribution",
    surface: "base-wrapper",
    supportedStyles: [],
    supportsStyleArg: false,
    summary: "Show numeric distribution by bins rather than individual raw points.",
    useWhen: [
      "The prompt is about the shape of a numeric distribution",
      "Continuous numeric values should be aggregated into bins",
      "Frequency or count by range matters",
    ],
    avoidWhen: [
      "Values are categorical rather than continuous",
      "The user already has quartiles and wants a box plot instead",
    ],
    askBeforeCoding: [
      "Are raw values provided or are bins already computed?",
      "How many bins should be used?",
      "Are we showing count, density, or a normalized frequency?",
    ],
    implementationNotes: [
      "Use chart-presets HistogramChart as a base wrapper.",
      "Bin strategy changes interpretation, so do not guess quietly.",
      "If the prompt starts asking for KDE curves or multiple distributions, you may need a novel hybrid pattern.",
    ],
    overrideSurface: [
      "bar: own bin appearance",
      "dataLabel: annotate frequency selectively",
      "grid / axes: support distribution reading",
      "layout: keep the chart focused on count semantics",
    ],
    escapeHatch:
      "Go headless if binning logic, overlays, or distribution interaction go beyond the base wrapper.",
    dataShape: `{
  values: [12, 14, 14, 18, 21, 24, 24, 25, 27, 31, 33, 36],
  binCount: 6
}`,
    sourcePaths: [
      "shared/chart-presets/charts/histogram-chart",
      "packages/chart/src/headless/histogram-chart",
    ],
    evaluation: {
      title: "Continuous latency distribution",
      prompt:
        "Show the distribution of API latency so we can see whether values cluster or spread out.",
      mustAsk: [
        "Are raw values or precomputed bins provided?",
        "How should the bin count be chosen?",
      ],
      successCriteria: [
        "Chooses histogram rather than bar",
        "Treats binning as a first-class question",
        "Recognizes this is a base-wrapper chart",
      ],
      criticFocus: [
        "Did the reader confuse histogram with categorical bar chart?",
        "Did it ignore the binning question?",
      ],
    },
  }),
  chart({
    slug: "sankey-chart",
    title: "Sankey Chart",
    importName: "SankeyChart",
    category: "flow",
    surface: "base-wrapper",
    supportedStyles: [],
    supportsStyleArg: false,
    summary: "Show weighted flow between stages with controller-owned layout.",
    useWhen: [
      "The prompt is weighted flow from source to target",
      "Branching matters more than totals alone",
      "Node and link layout must be computed from the data",
    ],
    avoidWhen: [
      "The flow is strictly sequential dropoff, which may be funnel",
      "The data is a generic graph rather than weighted stage-to-stage flow",
    ],
    askBeforeCoding: [
      "Is stage ordering fixed or derived?",
      "Should links inherit source color, target color, or a neutral scale?",
      "How dense can node labels be before truncation or hover is needed?",
    ],
    implementationNotes: [
      "Use chart-presets SankeyChart as a base wrapper on top of controller-owned layout.",
      "This is one of the clearest cases where the controller does real geometry work.",
      "If the request becomes an interactive flow editor, leave chart framing behind.",
    ],
    overrideSurface: [
      "node / link / nodeLabel: own the visible flow marks",
      "sankey: control stacking order",
      "layout: manage title and surrounding shell",
      "title: explain the denominator or flow context",
    ],
    escapeHatch:
      "Go headless if the layout, routing, or interaction model needs to diverge from the default sankey controller.",
    dataShape: `{
  nodes: [
    { id: "visit", label: "Visit" },
    { id: "signup", label: "Sign Up" },
    { id: "paid", label: "Paid" }
  ],
  links: [
    { source: "visit", target: "signup", value: 4800 },
    { source: "signup", target: "paid", value: 840 }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/sankey-chart",
      "packages/chart/src/headless/sankey-chart",
    ],
    evaluation: {
      title: "Weighted stage-to-stage flow",
      prompt:
        "Visualize how users flow from Visit to Sign Up to Paid, with weighted links showing where volume moves.",
      mustAsk: [
        "Is stage ordering fixed?",
        "How should link and node colors be determined?",
      ],
      successCriteria: [
        "Chooses sankey rather than funnel or network",
        "Recognizes controller-owned layout",
        "Uses the base wrapper before diving into custom geometry",
      ],
      criticFocus: [
        "Did the reader confuse weighted flow with simple stage dropoff?",
        "Did it ignore layout/color questions?",
      ],
    },
  }),
  chart({
    slug: "sunburst-chart",
    title: "Sunburst Chart",
    importName: "SunburstChart",
    category: "hierarchy",
    surface: "base-wrapper",
    supportedStyles: [],
    supportsStyleArg: false,
    summary: "Display hierarchical composition as concentric radial segments.",
    useWhen: [
      "The data is hierarchical and part-to-whole at multiple depths matters",
      "The prompt sounds like radial hierarchy rather than flat composition",
      "Depth and parent-child context are important",
    ],
    avoidWhen: [
      "A treemap would communicate area hierarchy more clearly",
      "The hierarchy is shallow enough that pie or donut would do",
    ],
    askBeforeCoding: [
      "How many hierarchy levels need to be visible?",
      "Do labels belong directly on segments or in legend/hover?",
      "Would treemap be more readable for this audience?",
    ],
    implementationNotes: [
      "Use chart-presets SunburstChart as a base wrapper.",
      "Label density is the first thing that breaks on sunbursts.",
      "This is a good candidate for novel label behavior or legend composition.",
    ],
    overrideSurface: [
      "segment: own each radial hierarchy segment",
      "legend / legendItem: explain depth or grouping",
      "sunburst: manage segment layering",
      "layout: make room for legends and hierarchy explanation",
    ],
    escapeHatch:
      "Go headless if depth, label routing, or interaction exceed the base wrapper.",
    dataShape: `{
  root: {
    label: "Company",
    children: [
      { label: "Product", children: [{ label: "Core", value: 42 }, { label: "Add-ons", value: 18 }] },
      { label: "Services", children: [{ label: "Support", value: 24 }, { label: "Consulting", value: 16 }] }
    ]
  }
}`,
    sourcePaths: [
      "shared/chart-presets/charts/sunburst-chart",
      "packages/chart/src/headless/sunburst-chart",
    ],
    evaluation: {
      title: "Hierarchical revenue composition",
      prompt:
        "Show revenue contribution by business line and product family in a radial hierarchy.",
      mustAsk: [
        "How many levels of hierarchy need to be visible?",
        "Are direct labels readable or should legend/hover carry more of the load?",
      ],
      successCriteria: [
        "Chooses sunburst for radial hierarchy",
        "Calls out label-density risk",
        "Treats it as a base-wrapper chart, not a themed preset",
      ],
      criticFocus: [
        "Did the reader flatten hierarchy into pie?",
        "Did it ignore depth and label questions?",
      ],
    },
  }),
  chart({
    slug: "treemap-chart",
    title: "Treemap Chart",
    importName: "TreemapChart",
    category: "hierarchy",
    surface: "base-wrapper",
    supportedStyles: [],
    supportsStyleArg: false,
    summary: "Represent proportional rectangles in a dense area-based map.",
    useWhen: [
      "Area proportionality matters more than radial context",
      "The prompt sounds like market-share blocks or dense composition map",
      "Labelable rectangles are preferable to radial slices",
    ],
    avoidWhen: [
      "The audience needs radial hierarchy context",
      "There are very few categories and a simpler chart would read better",
    ],
    askBeforeCoding: [
      "How dense can labels be inside rectangles?",
      "Do colors carry grouping semantics or only visual distinction?",
      "Is the data flat or should it behave like hierarchy externally even if the current type is flat?",
    ],
    implementationNotes: [
      "Use chart-presets TreemapChart as a base wrapper.",
      "Current data type is flat node-based, so do not invent deeper hierarchy support without saying so.",
      "Treemap label density and color semantics are the main design pressure points.",
    ],
    overrideSurface: [
      "node: own rectangle body and in-node label layout",
      "treemap: control node layering",
      "legend: explain grouping if colors imply structure",
      "layout: give labels enough breathing room",
    ],
    escapeHatch:
      "Go headless if layout strategy, label routing, or pseudo-hierarchy support need to change materially.",
    dataShape: `{
  nodes: [
    { label: "Enterprise", value: 42, color: "#4e79a7" },
    { label: "SMB", value: 26, color: "#f28e2b" },
    { label: "Mid-Market", value: 18, color: "#59a14f" },
    { label: "Channel", value: 14, color: "#e15759" }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/treemap-chart",
      "packages/chart/src/headless/treemap-chart",
    ],
    evaluation: {
      title: "Dense composition rectangle map",
      prompt:
        "Show revenue contribution by segment as proportionally sized rectangles with labels inside where possible.",
      mustAsk: [
        "How dense can labels be inside the rectangles?",
        "Do colors carry grouping semantics?",
      ],
      successCriteria: [
        "Chooses treemap rather than pie or sunburst for dense area comparison",
        "Calls out label-density risk",
        "Does not invent unsupported deep hierarchy semantics silently",
      ],
      criticFocus: [
        "Did the reader choose a radial chart when area blocks fit better?",
        "Did it ignore the current flat-data nature of the type?",
      ],
    },
  }),
  chart({
    slug: "waterfall-chart",
    title: "Waterfall Chart",
    importName: "WaterfallChart",
    category: "cumulative",
    surface: "base-wrapper",
    supportedStyles: [],
    supportsStyleArg: false,
    summary: "Show cumulative change through increases, decreases, and totals.",
    useWhen: [
      "The story is stepwise cumulative change",
      "Interim increases and decreases matter before a final total",
      "The prompt sounds like bridge chart or variance walk",
    ],
    avoidWhen: [
      "Plain category comparison is enough",
      "The data is not cumulative or sequential",
    ],
    askBeforeCoding: [
      "Which indices are totals?",
      "Do positive, negative, and total bars require distinct semantics?",
      "Should connectors be visible or subdued?",
    ],
    implementationNotes: [
      "Use chart-presets WaterfallChart as a base wrapper.",
      "Total indices are not optional semantics; clarify them early.",
      "This is a cumulative story, not just a signed bar chart.",
    ],
    overrideSurface: [
      "bar: own increase/decrease/total rendering",
      "connector: explain cumulative linkage",
      "dataLabel: surface type-aware labels",
      "axes / grid / layout: reinforce cumulative context",
    ],
    escapeHatch:
      "Go headless if cumulative rules, subtotals, or hybrid overlays exceed the base wrapper.",
    dataShape: `{
  labels: ["Start", "Upsell", "Churn", "Expansion", "End"],
  values: [120, 24, -18, 12, 0],
  totals: [
    { totalType: "total", index: 0 },
    { totalType: "total", index: 4 }
  ]
}`,
    sourcePaths: [
      "shared/chart-presets/charts/waterfall-chart",
      "packages/chart/src/headless/waterfall-chart",
    ],
    evaluation: {
      title: "Bridge from start to finish value",
      prompt:
        "Show how we move from starting ARR to ending ARR through upsell, churn, and expansion.",
      mustAsk: [
        "Which bars are totals or subtotals?",
        "Do connectors need to be visually explicit?",
      ],
      successCriteria: [
        "Chooses waterfall rather than signed bar chart",
        "Treats total indices as explicit semantics",
        "Uses the base wrapper and its dedicated bar/connector slots",
      ],
      criticFocus: [
        "Did the reader flatten the cumulative story into normal bars?",
        "Did it ignore total/subtotal semantics?",
      ],
    },
  }),
];

export const novelPatterns = [
  {
    slug: "multi-chart-dashboard",
    title: "Multi-Chart Dashboard Composition",
    summary: "Compose multiple charts in one screen when one chart family cannot carry the whole story.",
    useWhen: [
      "The prompt asks for overview plus breakdown plus detail",
      "A single chart would overload encodings",
      "Different chart families answer different sub-questions",
    ],
    buildPath: [
      "Choose one dominant chart per question instead of forcing a combo chart.",
      "Use Column, Row, Expanded, Padding, and Stack to compose the dashboard.",
      "Share filters or selection state through ChangeNotifierProvider when linked interactions matter.",
    ],
    sourcePaths: [
      "packages/core/src/component",
      "packages/core/src/provider",
      "shared/chart-presets/charts",
    ],
    relatedCharts: ["bar-chart", "line-chart", "heatmap-chart"],
  },
  {
    slug: "linked-hover-and-filter",
    title: "Linked Hover And Filter",
    summary: "Coordinate hover, legend filtering, and focus across multiple charts or panels.",
    useWhen: [
      "The prompt asks for synchronized hover or shared legend filtering",
      "One chart should highlight related data in another chart",
      "The experience is analytical rather than purely static",
    ],
    buildPath: [
      "Move shared selection or hover into a controller rather than duplicating local state.",
      "Use GestureDetector for pointer entry and exit.",
      "Use providers to broadcast selection state across composed widgets.",
    ],
    sourcePaths: [
      "packages/core/src/provider/ChangeNotifierProvider.ts",
      "packages/core/src/component/GestureDetector.ts",
      "packages/chart/src/headless",
    ],
    relatedCharts: ["scatter-chart", "bar-chart", "heatmap-chart"],
  },
  {
    slug: "controller-owned-layout",
    title: "Controller-Owned Layout Pattern",
    summary: "Use the controller to compute geometry first when the chart is fundamentally about layout.",
    useWhen: [
      "The chart needs algorithmic placement, not just axis scaling",
      "Node-link, flow, hierarchy, or diagram-like geometry is central",
      "Visual slots are just painting the computed layout",
    ],
    buildPath: [
      "Keep geometry computation in the controller.",
      "Keep chart.ts focused on composition and slot dispatch.",
      "Let custom renderers paint nodes, links, sectors, or segments from precomputed layout.",
    ],
    sourcePaths: [
      "packages/chart/src/headless/sankey-chart",
      "packages/chart/src/headless/sunburst-chart",
      "packages/chart/src/headless/treemap-chart",
    ],
    relatedCharts: ["sankey-chart", "sunburst-chart", "treemap-chart"],
  },
  {
    slug: "scorecard-composite",
    title: "Scorecard Composite Pattern",
    summary: "Build scorecard-like modules from chart parts plus direct Flitter primitives when no canned family fits.",
    useWhen: [
      "The request sounds like ranked cards, thresholds, and hover detail",
      "Charts and dashboard modules must coexist tightly",
      "A canned family would force the wrong abstraction",
    ],
    buildPath: [
      "Use chart-presets only for sub-parts that still map to a real chart family.",
      "Use Container, Column, Row, Stack, Text, and GestureDetector for the shell.",
      "Treat the result as direct composition, not as a disguised preset chart.",
    ],
    sourcePaths: [
      "packages/core/src/component",
      "dev/llm-playground",
      "docs/public/llm/critic-checklist.md",
    ],
    relatedCharts: ["bar-chart"],
  },
  {
    slug: "radial-kpi-composite",
    title: "Radial KPI Composite",
    summary: "Combine donut and custom paint ideas into one radial KPI experience.",
    useWhen: [
      "The prompt asks for multiple bounded metrics in a radial arrangement",
      "A simple donut is not enough on its own",
      "The center and ring composition matter as much as the metric values",
    ],
    buildPath: [
      "Start by deciding whether any ring can stay as an existing chart family.",
      "Use Stack, Center, and CustomPaint to compose rings and center content.",
      "Keep each radial layer semantically separate instead of faking one giant custom chart too early.",
    ],
    sourcePaths: [
      "shared/chart-presets/charts/donut-chart",
      "packages/core/src/component/CustomPaint.ts",
    ],
    relatedCharts: ["donut-chart"],
  },
  {
    slug: "novel-data-composite",
    title: "Novel Data Composite",
    summary: "Invent a new chart-like composition when the data story does not match any canonical family.",
    useWhen: [
      "The prompt explicitly rejects standard chart-library screenshots",
      "Multiple encodings and panels belong to one coherent artifact",
      "The semantics are closer to an application surface than a single chart",
    ],
    buildPath: [
      "Prove that the canonical families do not fit first.",
      "Extract reusable ideas from headless charts, not just their final shapes.",
      "Build the composition from Flitter primitives, controllers, and custom paint as needed.",
    ],
    sourcePaths: [
      "packages/chart/src/headless",
      "packages/core/src/component",
      "packages/core/src/provider",
      "packages/core/src/animation",
    ],
    relatedCharts: [],
  },
];

export const coreConcepts = [
  {
    slug: "composition-layout",
    title: "Composition And Layout",
    summary: "Most chart shells are built from standard layout widgets before any custom painting happens.",
    points: [
      "Use Column, Row, Expanded, Padding, Stack, Positioned, and SizedBox to shape the chart shell.",
      "Keep layout predictable before introducing custom geometry.",
      "When a chart needs size awareness, pair the shell with LayoutBuilder-like patterns or controller size updates.",
    ],
    sourcePaths: [
      "packages/core/src/component",
      "docs/src/app/advanced/layout-constraints/page.mdx",
      "docs/src/app/advanced/widgets/column/page.mdx",
      "docs/src/app/advanced/widgets/stack/page.mdx",
    ],
  },
  {
    slug: "provider-controller-state",
    title: "Provider And Controller State",
    summary: "Headless charts rely on controllers plus providers rather than local ad hoc state.",
    points: [
      "Use ChangeNotifier for chart state and derived layout.",
      "Use ChangeNotifierProvider to expose controllers to composed widgets.",
      "Put shared hover, filtering, and visibility state in controllers when multiple parts need it.",
    ],
    sourcePaths: [
      "packages/core/src/provider/ChangeNotifier.ts",
      "packages/core/src/provider/ChangeNotifierProvider.ts",
      "docs/src/app/advanced/state-management/page.mdx",
    ],
  },
  {
    slug: "animation-primitives",
    title: "Animation Primitives",
    summary: "Chart motion is built from explicit animation controllers, tweens, and animated widgets.",
    points: [
      "Use AnimationController, Tween, and CurvedAnimation for controlled motion.",
      "Use animated widgets when the motion maps to size, position, opacity, or transform.",
      "Keep animation local to view behavior unless controller state genuinely owns it.",
    ],
    sourcePaths: [
      "packages/core/src/animation",
      "docs/src/app/advanced/animation/page.mdx",
      "docs/src/app/advanced/widgets/animated-fractionally-sized-box/page.mdx",
    ],
  },
  {
    slug: "custom-paint-geometry",
    title: "Custom Paint And Geometry",
    summary: "Arc, path, link, and other bespoke marks should be painted directly when widgets are not enough.",
    points: [
      "Use CustomPaint for slices, arcs, links, and arbitrary vector shapes.",
      "Keep geometry data outside the painter when the same geometry must drive labels or interaction.",
      "Let controllers compute reusable layout and let painters render it.",
    ],
    sourcePaths: [
      "packages/core/src/component/CustomPaint.ts",
      "docs/src/app/advanced/widgets/custom-paint/page.mdx",
      "packages/chart/src/shared/utils",
    ],
  },
  {
    slug: "interaction-and-hit-testing",
    title: "Interaction And Hit Testing",
    summary: "Hover, selection, and tooltip behavior come from explicit hit-testing widgets and shared state.",
    points: [
      "Use GestureDetector for hover and click behavior.",
      "Use Tooltip and ZIndex when focus detail must float above chart content.",
      "Coordinate interaction state through providers when multiple marks must respond together.",
    ],
    sourcePaths: [
      "packages/core/src/component/GestureDetector.ts",
      "packages/core/src/component/Tooltip.ts",
      "packages/core/src/component/ZIndex.ts",
      "docs/src/app/advanced/widgets/gesture-detector/page.mdx",
      "docs/src/app/advanced/widgets/tooltip/page.mdx",
    ],
  },
  {
    slug: "novel-chart-decision",
    title: "Novel Chart Decision",
    summary: "Leave preset land only after proving that the canonical families cannot answer the prompt honestly.",
    points: [
      "Reject the nearest canned chart if it distorts the semantics.",
      "Reuse controller, layout, and paint ideas from headless charts instead of starting from zero.",
      "Document why the result is a direct composition or novel chart pattern.",
    ],
    sourcePaths: [
      "docs/public/llm/chart.md",
      "docs/public/llm/critic-checklist.md",
      "packages/chart/src/headless",
    ],
  },
];

export const coreWidgets = [
  {
    slug: "column",
    title: "Column",
    category: "layout",
    summary: "Vertical layout primitive for chart shells, legends, and stacked panels.",
    useWhen: "Use for title above chart, dashboard sections, or ordered vertical content.",
    sourcePaths: [
      "packages/core/src/component/Column.ts",
      "docs/src/app/advanced/widgets/column/page.mdx",
    ],
  },
  {
    slug: "row",
    title: "Row",
    category: "layout",
    summary: "Horizontal layout primitive for legends, paired metrics, and x-axis label rows.",
    useWhen: "Use for legend lines, toolbars, or side-by-side chart sections.",
    sourcePaths: [
      "packages/core/src/component/Row.ts",
      "docs/src/app/advanced/widgets/row/page.mdx",
    ],
  },
  {
    slug: "stack",
    title: "Stack",
    category: "layout",
    summary: "Layer children visually in the same space.",
    useWhen: "Use for grid behind data, annotations above marks, or radial center overlays.",
    sourcePaths: [
      "packages/core/src/component/Stack.ts",
      "docs/src/app/advanced/widgets/stack/page.mdx",
    ],
  },
  {
    slug: "positioned",
    title: "Positioned",
    category: "layout",
    summary: "Place a child precisely within a Stack.",
    useWhen: "Use for node-link charts, labels anchored to geometry, and overlay annotations.",
    sourcePaths: [
      "packages/core/src/component/Positioned.ts",
      "docs/src/app/advanced/widgets/positioned/page.mdx",
    ],
  },
  {
    slug: "expanded",
    title: "Expanded",
    category: "layout",
    summary: "Let a child take remaining space within Flex, Row, or Column.",
    useWhen: "Use for plot areas that must fill the remaining shell space.",
    sourcePaths: [
      "packages/core/src/component/Expanded.ts",
      "docs/src/app/advanced/widgets/expanded/page.mdx",
    ],
  },
  {
    slug: "sized-box",
    title: "SizedBox",
    category: "layout",
    summary: "Fixed spacing or fixed-size placeholder widget.",
    useWhen: "Use for spacing, tiny marks, or simple placeholders in chart shells.",
    sourcePaths: [
      "packages/core/src/component/SizedBox.ts",
      "docs/src/app/advanced/widgets/sized-box/page.mdx",
    ],
  },
  {
    slug: "container",
    title: "Container",
    category: "layout",
    summary: "General-purpose box for size, decoration, alignment, and background.",
    useWhen: "Use for bars, cards, labels, backgrounds, or any simple block mark.",
    sourcePaths: [
      "packages/core/src/component/Container.ts",
      "docs/src/app/advanced/widgets/container/page.mdx",
    ],
  },
  {
    slug: "padding",
    title: "Padding",
    category: "layout",
    summary: "Inset content from its edges.",
    useWhen: "Use to keep chart shells and text from colliding with bounds.",
    sourcePaths: [
      "packages/core/src/component/Padding.ts",
      "docs/src/app/advanced/widgets/padding/page.mdx",
    ],
  },
  {
    slug: "align",
    title: "Align",
    category: "layout",
    summary: "Align one child within its available box.",
    useWhen: "Use to pin labels, bars, or center content inside a container.",
    sourcePaths: [
      "packages/core/src/component/Align.ts",
      "docs/src/app/advanced/widgets/align/page.mdx",
    ],
  },
  {
    slug: "flex",
    title: "Flex",
    category: "layout",
    summary: "Lower-level flex primitive when Row or Column is too specific.",
    useWhen: "Use when chart orientation must swap or flex direction needs to be dynamic.",
    sourcePaths: [
      "packages/core/src/component/Flex.ts",
      "docs/src/app/advanced/widgets/flex/page.mdx",
    ],
  },
  {
    slug: "flexible",
    title: "Flexible",
    category: "layout",
    summary: "Participate in flex layout without forcing full expansion.",
    useWhen: "Use for mixed-flex legend or chart shell layouts.",
    sourcePaths: [
      "packages/core/src/component/Flexible.ts",
      "docs/src/app/advanced/widgets/flexible/page.mdx",
    ],
  },
  {
    slug: "fractionally-sized-box",
    title: "FractionallySizedBox",
    category: "layout",
    summary: "Size a child as a fraction of available space.",
    useWhen: "Use for bars, fills, and marks driven by ratios.",
    sourcePaths: [
      "packages/core/src/component/FractionallySizedBox.ts",
      "docs/src/app/advanced/widgets/fractionally-sized-box/page.mdx",
    ],
  },
  {
    slug: "animated-fractionally-sized-box",
    title: "AnimatedFractionallySizedBox",
    category: "animation",
    summary: "Animate ratio-driven size changes smoothly.",
    useWhen: "Use for grow-in bars, reveals, and progress fills.",
    sourcePaths: [
      "packages/core/src/component/AnimatedFractionallySizedBox.ts",
      "docs/src/app/advanced/widgets/animated-fractionally-sized-box/page.mdx",
    ],
  },
  {
    slug: "custom-paint",
    title: "CustomPaint",
    category: "painting",
    summary: "Draw custom vector or canvas content directly.",
    useWhen: "Use for arcs, paths, links, sectors, and bespoke visual marks.",
    sourcePaths: [
      "packages/core/src/component/CustomPaint.ts",
      "docs/src/app/advanced/widgets/custom-paint/page.mdx",
    ],
  },
  {
    slug: "gesture-detector",
    title: "GestureDetector",
    category: "interaction",
    summary: "Capture pointer and gesture events.",
    useWhen: "Use for hover, click, and focus behavior on chart marks.",
    sourcePaths: [
      "packages/core/src/component/GestureDetector.ts",
      "docs/src/app/advanced/widgets/gesture-detector/page.mdx",
    ],
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    category: "interaction",
    summary: "Floating detail surface for hover or focus information.",
    useWhen: "Use when a chart needs transient detail without permanent labels.",
    sourcePaths: [
      "packages/core/src/component/Tooltip.ts",
      "docs/src/app/advanced/widgets/tooltip/page.mdx",
    ],
  },
  {
    slug: "clip-rect",
    title: "ClipRect",
    category: "painting",
    summary: "Clip child content to a rectangular region.",
    useWhen: "Use for reveal animations, plot bounds, or overflow trimming.",
    sourcePaths: [
      "packages/core/src/component/ClipRect.ts",
      "docs/src/app/advanced/widgets/clip-rect/page.mdx",
    ],
  },
  {
    slug: "transform",
    title: "Transform",
    category: "painting",
    summary: "Translate, rotate, or scale a child visually.",
    useWhen: "Use for rotated labels, radial sectors, or custom geometry placement.",
    sourcePaths: [
      "packages/core/src/component/Transform.ts",
      "docs/src/app/advanced/widgets/transform/page.mdx",
    ],
  },
  {
    slug: "text",
    title: "Text",
    category: "content",
    summary: "Basic text primitive for labels and titles.",
    useWhen: "Use for axis labels, legends, titles, and direct mark annotation.",
    sourcePaths: [
      "packages/core/src/component/Text.ts",
      "docs/src/app/advanced/widgets/text/page.mdx",
    ],
  },
  {
    slug: "rich-text",
    title: "RichText",
    category: "content",
    summary: "Multi-style text primitive.",
    useWhen: "Use when labels or annotations need mixed emphasis in one block.",
    sourcePaths: [
      "packages/core/src/component/RichText.ts",
      "docs/src/app/advanced/widgets/rich-text/page.mdx",
    ],
  },
  {
    slug: "z-index",
    title: "ZIndex",
    category: "interaction",
    summary: "Explicit stacking priority for overlays.",
    useWhen: "Use for tooltips, drag handles, and hover details above chart layers.",
    sourcePaths: [
      "packages/core/src/component/ZIndex.ts",
      "docs/src/app/advanced/widgets/z-index/page.mdx",
    ],
  },
];

export const novelEvaluationCases = [
  {
    id: "novel-scorecard-layout",
    title: "Novel ranked scorecard that is not a canned chart",
    prompt:
      "We want ranked business units with score bars, target markers, and a hover detail panel. It should feel like a composite scorecard, not a standard chart library screenshot.",
    recommendedCharts: [],
    pack: ["/llm/chart.md", "/llm/patterns/scorecard-composite.md"],
    mustAsk: [
      "Does this still map to a chart preset, or should it jump to headless or direct flitter primitives?",
      "Which parts are chart-like and which are dashboard composition?",
    ],
    successCriteria: [
      "Rejects the temptation to force the prompt into an incorrect canned chart",
      "Explains why headless or direct primitive composition is the right move",
      "Names reusable chart ideas without pretending a direct preset exists",
    ],
    criticFocus: [
      "Did the reader force a bar, radar, or bubble chart just because those exist?",
      "Did it clearly justify the escape hatch?",
    ],
  },
  {
    id: "multi-chart-exec-dashboard",
    title: "Executive dashboard with overview and drilldown",
    prompt:
      "Build an executive dashboard with top-line revenue trend, current pipeline composition, and a region comparison panel. One chart cannot carry the whole story.",
    recommendedCharts: ["line-chart", "pie-chart", "bar-chart"],
    pack: ["/llm/chart.md", "/llm/patterns/multi-chart-dashboard.md"],
    mustAsk: [
      "Which question does each panel answer?",
      "Should filters or hover state link the panels together?",
    ],
    successCriteria: [
      "Splits the story into multiple charts instead of one overloaded combo chart",
      "Uses layout primitives intentionally",
      "Calls out shared state only if interaction is actually needed",
    ],
    criticFocus: [
      "Did the reader cram everything into one hybrid chart?",
      "Did it ignore composition-level layout?",
    ],
  },
  {
    id: "linked-hover-analysis",
    title: "Linked hover across charts",
    prompt:
      "When I hover a campaign in the scatter plot, I want the same campaign highlighted in the bar comparison and detail panel.",
    recommendedCharts: ["scatter-chart", "bar-chart"],
    pack: ["/llm/chart.md", "/llm/patterns/linked-hover-and-filter.md"],
    mustAsk: [
      "Is hover or selection state shared globally?",
      "Which panels need to react and how?",
    ],
    successCriteria: [
      "Moves shared interaction into controller/provider state",
      "Does not fake linked behavior with isolated local state",
      "Uses direct composition only where necessary",
    ],
    criticFocus: [
      "Did the reader leave linked state in separate local components?",
      "Did it ignore provider-based coordination?",
    ],
  },
  {
    id: "radial-kpi-composite",
    title: "Radial KPI composite",
    prompt:
      "Create a radial KPI module with an overall completion donut, an inner status label, and threshold arcs around it for health.",
    recommendedCharts: ["donut-chart"],
    pack: ["/llm/chart.md", "/llm/patterns/radial-kpi-composite.md"],
    mustAsk: [
      "Which ring is a real chart family and which ring is custom composition?",
      "What does the center content need to express?",
    ],
    successCriteria: [
      "Uses donut plus custom threshold arcs without pretending one canned chart solves everything",
      "Separates radial layers semantically",
      "Escalates to custom composition only where needed",
    ],
    criticFocus: [
      "Did the reader try to force the whole thing into one existing family?",
      "Did it miss center-content semantics?",
    ],
  },
  {
    id: "novel-data-composite",
    title: "Novel data composite beyond existing families",
    prompt:
      "We need a chart-like artifact that combines ranked cards, trend sparklines, and threshold badges for each business unit.",
    recommendedCharts: [],
    pack: ["/llm/chart.md", "/llm/patterns/novel-data-composite.md"],
    mustAsk: [
      "Which subparts still map to canonical chart families?",
      "What shared layout and state model holds the whole artifact together?",
    ],
    successCriteria: [
      "Decomposes the request into chart and non-chart subparts",
      "Does not invent a fake single chart family",
      "Uses direct Flitter composition deliberately",
    ],
    criticFocus: [
      "Did the reader fake a single chart family for a clearly composite request?",
      "Did it ignore composition and state planning?",
    ],
  },
];

export const widgetCatalogPaths = {
  markdown: "/llm/core/widget-catalog.md",
  json: "/llm/core/widget-catalog.json",
};

export const patternRegistryPaths = {
  markdown: "/llm/patterns.md",
  json: "/llm/pattern-registry.json",
};
