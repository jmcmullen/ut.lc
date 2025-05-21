import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error("DefaultCatchBoundary Error:", error);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
          }}
          className={`bg-gray-600 dark:bg-gray-700 rounded px-2 py-1 font-extrabold uppercase text-white`}
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className={`bg-gray-600 dark:bg-gray-700 rounded px-2 py-1 font-extrabold uppercase text-white`}
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className={`bg-gray-600 dark:bg-gray-700 rounded px-2 py-1 font-extrabold uppercase text-white`}
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
}
