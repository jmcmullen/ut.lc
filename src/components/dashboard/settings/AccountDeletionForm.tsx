import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { checkHasPassword, deleteAccount } from "~/actions/accountActions";

export function AccountDeletionForm() {
  const [message, setMessage] = useState<{
    type: "error";
    text: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user has password on mount
  React.useEffect(() => {
    checkHasPassword()
      .then((result) => {
        setHasPassword(result.hasPassword);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const form = useForm({
    defaultValues: {
      confirmation: "",
      password: "",
    },
    validators: {
      onChange: (values) => {
        const errors: Record<string, string> = {};

        if (values.value.confirmation !== "DELETE") {
          errors.confirmation = "Please type DELETE to confirm";
        }

        if (
          hasPassword &&
          (!values.value.password || values.value.password.length === 0)
        ) {
          errors.password = "Password is required to delete account";
        }

        return Object.keys(errors).length > 0 ? errors : undefined;
      },
    },
    onSubmit: async (data) => {
      setMessage(null);

      try {
        await deleteAccount({
          data: {
            password: hasPassword ? data.value.password : undefined,
            hasPassword: hasPassword || false,
          },
        });
      } catch {
        setMessage({
          type: "error",
          text: hasPassword
            ? "Failed to delete account. Please check your password and try again."
            : "Failed to delete account. Please try again.",
        });
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  if (loading) {
    return (
      <div className="border-red-200 mt-6 rounded-lg border-2 bg-white p-6 shadow-sm">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="border-red-200 mt-6 rounded-lg border-2 bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-red-900 mb-4 text-lg font-medium">Delete Account</h2>

        <div className="text-gray-600 mb-4 text-sm">
          <p className="mb-2">
            <strong className="text-red-600">Warning:</strong> This action is permanent
            and cannot be undone.
          </p>
          <p>Deleting your account will:</p>
          <ul className="ml-2 mt-1 list-inside list-disc space-y-1">
            <li>Remove all your shortened URLs</li>
            <li>Delete all click analytics data</li>
            <li>Permanently delete your profile information</li>
          </ul>
        </div>

        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500 inline-flex justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            I understand, delete my account
          </button>
        ) : (
          <>
            {message && (
              <div className="bg-red-50 text-red-800 border-red-200 mb-4 rounded-lg border p-4">
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <form.Field name="confirmation">
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="text-gray-700 block text-sm font-medium"
                    >
                      Type <span className="font-mono font-bold">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="focus:border-red-500 focus:ring-red-500 border-gray-300 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm"
                      placeholder="Type DELETE"
                    />
                    {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                      <p className="text-red-600 mt-1 text-sm">
                        {field.state.meta.errors
                          .map(
                            (error) => (error as unknown as { message: string })?.message,
                          )
                          .join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {hasPassword && (
                <form.Field name="password">
                  {(field) => (
                    <div>
                      <label
                        htmlFor={field.name}
                        className="text-gray-700 block text-sm font-medium"
                      >
                        Enter your password to confirm
                      </label>
                      <input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="focus:border-red-500 focus:ring-red-500 border-gray-300 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm"
                        placeholder="Enter your password"
                      />
                      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                        <p className="text-red-600 mt-1 text-sm">
                          {field.state.meta.errors
                            .map(
                              (error) =>
                                (error as unknown as { message: string })?.message,
                            )
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    form.reset();
                    setMessage(null);
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 inline-flex justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? "Deleting..." : "Delete Account Permanently"}
                    </button>
                  )}
                />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
