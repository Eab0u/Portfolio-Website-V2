"use client";

import { Component, type ReactNode } from "react";

// Renders the fallback (nothing by default) if a child throws, for example a model that fails to load or a device
// without WebGL, so the rest of the scene and page survive.
type Props = { children: ReactNode; fallback?: ReactNode };
export default class ModelErrorBoundary extends Component<
  Props,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Scene failed to render", error);
  }

  render() {
    return this.state.failed
      ? (this.props.fallback ?? null)
      : this.props.children;
  }
}
