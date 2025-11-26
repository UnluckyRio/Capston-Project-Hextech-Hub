type LoadingOverlayProps = {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  label?: string;
};

export default function LoadingOverlay({
  loading,
  error,
  onRetry,
  label = "Loading…",
}: LoadingOverlayProps) {
  if (!loading && !error) return null;

  return (
    <div
      className="loading-overlay"
      role="status"
      aria-live="polite"
      aria-busy={loading}
    >
      <div className="loading-surface" aria-label={label}>
        {loading && (
          <>
            <div className="spinner-ring" aria-hidden="true" />
            <p className="loading-label">{label}</p>
          </>
        )}
        {!loading && error && (
          <div className="loading-error" role="alert">
            <p>Unexpected error: {error}</p>
            {onRetry && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onRetry}
              >
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
