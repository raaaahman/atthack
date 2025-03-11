import { Component, ComponentType, PropsWithChildren } from "react";

type ErrorProps = PropsWithChildren<{
  FallbackComponent: ComponentType;
}>;

export class ErrorBoundary extends Component<
  ErrorProps,
  { hasError: boolean }
> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { FallbackComponent } = this.props;

    return this.state.hasError ? <FallbackComponent /> : this.props.children;
  }
}
