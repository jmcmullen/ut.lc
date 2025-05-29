import { Copy, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "~/utils/auth-client";

// Types
interface ApiKey {
  id: string;
  name: string | null;
  start: string | null;
  createdAt: Date;
  expiresAt: Date | null;
  lastRequest: Date | null;
  remaining: number | null;
}

// Expiration options
const EXPIRATION_OPTIONS = [
  { label: "7 days", value: 7 * 24 * 60 * 60 },
  { label: "30 days", value: 30 * 24 * 60 * 60 },
  { label: "90 days", value: 90 * 24 * 60 * 60 },
  { label: "1 year", value: 365 * 24 * 60 * 60 },
  { label: "No expiration", value: null },
];

export function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedExpiration, setSelectedExpiration] = useState<number | null>(
    90 * 24 * 60 * 60,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [hasCopiedKey, setHasCopiedKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load API keys on mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  async function loadApiKeys() {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await authClient.apiKey.list();

      if (error) {
        throw new Error(error.message || "Failed to load API keys");
      }

      setApiKeys(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load API keys");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateKey() {
    if (!newKeyName.trim()) return;

    try {
      setIsCreating(true);
      setError(null);

      type CreateOptions = {
        name: string;
        prefix: string;
        expiresIn?: number;
      };

      const createOptions: CreateOptions = {
        name: newKeyName,
        prefix: "utlc_",
      };

      // Only add expiresIn if an expiration is selected
      if (selectedExpiration !== null) {
        createOptions.expiresIn = selectedExpiration;
      }

      const { data, error } = await authClient.apiKey.create(createOptions);

      if (error) {
        throw new Error(error.message || "Failed to create API key");
      }

      if (data?.key) {
        setShowNewKey(data.key);
        setNewKeyName("");
        setHasCopiedKey(false);
        await loadApiKeys();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteKey(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this API key? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setError(null);

      const { error } = await authClient.apiKey.delete({
        keyId: id,
      });

      if (error) {
        throw new Error(error.message || "Failed to delete API key");
      }

      await loadApiKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete API key");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setHasCopiedKey(true);
  }
  
  function handleDismissNewKey() {
    if (!hasCopiedKey) {
      if (!confirm("Are you sure you want to close without copying the API key? You won't be able to see it again.")) {
        return;
      }
    }
    setShowNewKey(null);
    setHasCopiedKey(false);
  }

  return (
    <div className="ring-gray-900/5 mt-8 bg-white shadow-sm ring-1 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-6 sm:p-8">
        <div className="max-w-2xl">
          <h2 className="text-gray-900 text-base font-semibold leading-7">API Keys</h2>
          <p className="text-gray-600 mt-1 text-sm leading-6">
            Manage API keys for programmatic access to your account.
          </p>

          {error && (
            <div className="bg-red-50 mt-4 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Create new key form */}
          <div className="mt-6 space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="API key name (e.g., Production App)"
                className="text-gray-900 ring-gray-300 placeholder:text-gray-400 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <select
                value={selectedExpiration ?? "null"}
                onChange={(e) =>
                  setSelectedExpiration(
                    e.target.value === "null" ? null : Number(e.target.value),
                  )
                }
                className="text-gray-900 ring-gray-300 block rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {EXPIRATION_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value ?? "null"}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleCreateKey}
                disabled={isCreating || !newKeyName.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Create Key
              </button>
            </div>
          </div>

          {/* New key display */}
          {showNewKey && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800">
                    API Key Created Successfully
                  </h3>
                  <p className="mt-1 text-sm text-green-700">
                    <strong>Important:</strong> Copy your API key now. For security reasons, it will not be shown again.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="rounded bg-green-100 px-2 py-1 text-sm text-green-800">
                      {showNewKey}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(showNewKey)}
                      className="text-green-600 hover:text-green-500"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {hasCopiedKey && (
                      <span className="text-green-600 text-sm">Copied!</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDismissNewKey}
                  className="ml-3 text-green-400 hover:text-green-500"
                  title="Close"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* API keys list */}
          <div className="mt-6">
            {isLoading ? (
              <p className="text-gray-500 text-sm">Loading API keys...</p>
            ) : apiKeys.length === 0 ? (
              <p className="text-gray-500 text-sm">No API keys created yet.</p>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="border-gray-200 flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 text-sm font-medium">
                          {key.name || "Unnamed Key"}
                        </p>
                        {key.start && (
                          <code className="text-gray-500 bg-gray-100 rounded px-2 py-0.5 text-xs">
                            {key.start}...
                          </code>
                        )}
                      </div>
                      <p className="text-gray-500 mt-1 text-xs">
                        Created {new Date(key.createdAt).toLocaleDateString()}
                        {key.lastRequest && (
                          <>
                            {" "}
                            • Last used {new Date(key.lastRequest).toLocaleDateString()}
                          </>
                        )}
                        {key.expiresAt ? (
                          <> • Expires {new Date(key.expiresAt).toLocaleDateString()}</>
                        ) : (
                          <> • Never expires</>
                        )}
                        {key.remaining !== null && (
                          <> • {key.remaining} requests remaining</>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteKey(key.id)}
                      className="text-gray-400 hover:text-red-600 ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
