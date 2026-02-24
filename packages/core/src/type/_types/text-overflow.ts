enum TextOverflow {
  /// Clip the overflowing text to fix its container.
  clip = 1,

  /// Render overflowing text outside of its container.
  visible = 2,

  /// Use an ellipsis to indicate that the text has overflowed.
  ellipsis = 3,

  /*
    Not implemented yet
    /// Fade the overflowing text to transparent.
    fade = "fade",

    /// Use an ellipsis to indicate that the text has overflowed.
    ellipsis = "ellipsis",
  */
}

export default TextOverflow;
