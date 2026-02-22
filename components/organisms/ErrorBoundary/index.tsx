import { Button } from '@/components/atoms/Button';
import { i18n } from '@/i18n/config';
import { createLogger } from '@/utils/logger';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Text, View } from 'react-native';

const logger = createLogger('ErrorBoundary');

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors to our custom Logger, and displays a fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught application error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.fallback) {
        return this.fallback;
      }

      return (
        <View className="flex-1 items-center justify-center bg-white p-6 dark:bg-zinc-950">
          <Text className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {i18n.t('errorBoundary.title')}
          </Text>
          <Text className="mb-8 text-center text-base text-zinc-500 dark:text-zinc-400">
            {i18n.t('errorBoundary.message')}
          </Text>
          <Button onPress={this.handleReset} variant="primary">
            {i18n.t('errorBoundary.retryText')}
          </Button>
        </View>
      );
    }

    return this.children;
  }

  private get children() {
    return this.props.children;
  }

  private get fallback() {
    return this.props.fallback;
  }
}
