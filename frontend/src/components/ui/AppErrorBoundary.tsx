import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error) {
    console.error('UI error boundary:', error)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center bg-slate-50 p-6 dark:bg-slate-950">
          <div className="max-w-md rounded-2xl border bg-card p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Une erreur est survenue</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Rechargez la page ou reconnectez-vous pour continuer.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

