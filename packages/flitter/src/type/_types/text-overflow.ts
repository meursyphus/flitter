enum TextOverflow {
  /// Clip the overflowing text to fix its container.
  clip = "clip",

  /// Render overflowing text outside of its container.
  visible = "visible",

  ellipsis = "ellipsis",

  /*
    Not implemented yet
    /// Fade the overflowing text to transparent.
    fade = "fade",

    /// Use an ellipsis to indicate that the text has overflowed.
    ellipsis = "ellipsis",
  */
}

export default TextOverflow