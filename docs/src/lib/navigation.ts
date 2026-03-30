export type NavItem = {
  title: string;
  href: string;
  status?: "available" | "coming" | "new" | "beta" | "alpha";
  children?: NavItem[];
  /** Visual hint: "style" items are grouped as siblings, others render normally */
  kind?: "style";
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type Navigation = {
  home?: NavItem;
  sections: NavSection[];
};

// Global sidebar for landing — library catalog
export const libraryNav: NavItem[] = [
  { title: "Chart", href: "/chart", status: "available" },
  { title: "Diagram", href: "#", status: "coming" },
];

// Ecosystem-level sidebar navigation (TanStack-style landing nav)
export const ecosystemNav: Navigation = {
  sections: [
    {
      title: "Getting Started",
      items: [
        { title: "Overview", href: "/" },
      ],
    },
    {
      title: "Products",
      items: [
        { title: "Chart", href: "/chart", status: "new" },
        { title: "Diagram", href: "/diagram", status: "coming" },
      ],
    },
    {
      title: "Learn",
      items: [
        { title: "Core API", href: "/advanced/what-is-flitter" },
        { title: "Integration", href: "/integration" },
      ],
    },
  ],
};

export const chartNav: Navigation = {
  sections: [
    {
      title: "Getting Started",
      items: [
        { title: "Overview", href: "/chart" },
        { title: "Installation", href: "/chart/installation" },
        { title: "Quick Start", href: "/chart/quick-start" },
      ],
    },
    {
      title: "Charts",
      items: [
        {
          title: "Bar Chart",
          href: "/chart/bar-chart",
          children: [{ title: "Advanced", href: "/chart/bar-chart/advanced" }],
        },
        {
          title: "Line Chart",
          href: "/chart/line-chart",
          children: [{ title: "Advanced", href: "/chart/line-chart/advanced" }],
        },
        {
          title: "Area Chart",
          href: "/chart/area-chart",
          children: [{ title: "Advanced", href: "/chart/area-chart/advanced" }],
        },
        {
          title: "Pie Chart",
          href: "/chart/pie-chart",
          children: [{ title: "Advanced", href: "/chart/pie-chart/advanced" }],
        },
        {
          title: "Scatter Chart",
          href: "/chart/scatter-chart",
          children: [{ title: "Advanced", href: "/chart/scatter-chart/advanced" }],
        },
        {
          title: "Radar Chart",
          href: "/chart/radar-chart",
          children: [{ title: "Advanced", href: "/chart/radar-chart/advanced" }],
        },
        {
          title: "Bubble Chart",
          href: "/chart/bubble-chart",
          children: [{ title: "Advanced", href: "/chart/bubble-chart/advanced" }],
        },
        {
          title: "Heatmap Chart",
          href: "/chart/heatmap-chart",
          children: [{ title: "Advanced", href: "/chart/heatmap-chart/advanced" }],
        },
        {
          title: "Stacked Bar Chart",
          href: "/chart/stacked-bar-chart",
          children: [{ title: "Advanced", href: "/chart/stacked-bar-chart/advanced" }],
        },
        {
          title: "Stacked Area Chart",
          href: "/chart/stacked-area-chart",
          children: [{ title: "Advanced", href: "/chart/stacked-area-chart/advanced" }],
        },
      ],
    },
  ],
};

export const advancedNav: NavSection[] = [
  {
    title: "Core Concepts",
    items: [
      { title: "What is Flitter?", href: "/advanced/what-is-flitter" },
      { title: "Widget System", href: "/advanced/widget-system" },
      { title: "State Management", href: "/advanced/state-management" },
      { title: "Layout & Constraints", href: "/advanced/layout-constraints" },
      { title: "Animation", href: "/advanced/animation" },
      { title: "RenderObject", href: "/advanced/render-object" },
      { title: "CustomPaint", href: "/advanced/custom-paint" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { title: "React", href: "/advanced/integrations/react" },
      { title: "Svelte", href: "/advanced/integrations/svelte" },
    ],
  },
  {
    title: "Widgets",
    items: [
      { title: "Align", href: "/advanced/widgets/align" },
      { title: "AnimatedAlign", href: "/advanced/widgets/animated-align" },
      { title: "AnimatedContainer", href: "/advanced/widgets/animated-container" },
      { title: "AnimatedFractionallySizedBox", href: "/advanced/widgets/animated-fractionally-sized-box" },
      { title: "AnimatedOpacity", href: "/advanced/widgets/animated-opacity" },
      { title: "AnimatedPadding", href: "/advanced/widgets/animated-padding" },
      { title: "AnimatedPositioned", href: "/advanced/widgets/animated-positioned" },
      { title: "AnimatedRotation", href: "/advanced/widgets/animated-rotation" },
      { title: "AnimatedScale", href: "/advanced/widgets/animated-scale" },
      { title: "AnimatedSlide", href: "/advanced/widgets/animated-slide" },
      { title: "AspectRatio", href: "/advanced/widgets/aspect-ratio" },
      { title: "Center", href: "/advanced/widgets/center" },
      { title: "ClipOval", href: "/advanced/widgets/clip-oval" },
      { title: "ClipPath", href: "/advanced/widgets/clip-path" },
      { title: "ClipRRect", href: "/advanced/widgets/clip-rrect" },
      { title: "ClipRect", href: "/advanced/widgets/clip-rect" },
      { title: "ColoredBox", href: "/advanced/widgets/colored-box" },
      { title: "Column", href: "/advanced/widgets/column" },
      { title: "ConstrainedBox", href: "/advanced/widgets/constrained-box" },
      { title: "ConstraintsTransformBox", href: "/advanced/widgets/constraints-transform-box" },
      { title: "Container", href: "/advanced/widgets/container" },
      { title: "CustomPaint", href: "/advanced/widgets/custom-paint" },
      { title: "DecoratedBox", href: "/advanced/widgets/decorated-box" },
      { title: "Draggable", href: "/advanced/widgets/draggable" },
      { title: "Expanded", href: "/advanced/widgets/expanded" },
      { title: "Flex", href: "/advanced/widgets/flex" },
      { title: "Flexible", href: "/advanced/widgets/flexible" },
      { title: "FractionalTranslation", href: "/advanced/widgets/fractional-translation" },
      { title: "FractionallySizedBox", href: "/advanced/widgets/fractionally-sized-box" },
      { title: "GestureDetector", href: "/advanced/widgets/gesture-detector" },
      { title: "Image", href: "/advanced/widgets/image" },
      { title: "IndexedStack", href: "/advanced/widgets/indexed-stack" },
      { title: "IntrinsicHeight", href: "/advanced/widgets/intrinsic-height" },
      { title: "IntrinsicWidth", href: "/advanced/widgets/intrinsic-width" },
      { title: "LimitedBox", href: "/advanced/widgets/limited-box" },
      { title: "Opacity", href: "/advanced/widgets/opacity" },
      { title: "OverflowBox", href: "/advanced/widgets/overflow-box" },
      { title: "Padding", href: "/advanced/widgets/padding" },
      { title: "Positioned", href: "/advanced/widgets/positioned" },
      { title: "RichText", href: "/advanced/widgets/rich-text" },
      { title: "Row", href: "/advanced/widgets/row" },
      { title: "SizedBox", href: "/advanced/widgets/sized-box" },
      { title: "Spacer", href: "/advanced/widgets/spacer" },
      { title: "Stack", href: "/advanced/widgets/stack" },
      { title: "Text", href: "/advanced/widgets/text" },
      { title: "Tooltip", href: "/advanced/widgets/tooltip" },
      { title: "Transform", href: "/advanced/widgets/transform" },
      { title: "UnconstrainedBox", href: "/advanced/widgets/unconstrained-box" },
      { title: "ZIndex", href: "/advanced/widgets/z-index" },
    ],
  },
];
