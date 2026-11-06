"use client";

import { Component, type ReactNode } from "react";

// Renders nothing if a child throws (for example a model that fails to load), so the rest of the scene survives.
export default class ModelErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Scene model failed to load", error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
