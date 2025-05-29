import { useForm } from "@tanstack/react-form";
import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import React, { useState } from "react";
import { z } from "zod";
import { auth } from "~/api/auth/auth";

// Validation schemas for different scenarios
const deleteWithPasswordSchema = z.object({
  confirmation: z.literal("DELETE", {
    errorMap: () => ({ message: "Please type DELETE to confirm" }),
  }),
  password: z.string().min(1, "Password is required to delete account"),
});

const deleteWithoutPasswordSchema = z.object({
  confirmation: z.literal("DELETE", {
    errorMap: () => ({ message: "Please type DELETE to confirm" }),
  }),
});

// Server function to check if user has password
const checkHasPassword = createServerFn({ method: "GET" })
  .handler(async () => {
    const headers = getHeaders();
    const session = await auth.api.getSession({
      headers: headers as HeadersInit,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // For now, we'll assume users have passwords unless they signed up with social login
    // In a real implementation, you'd check the user's account providers
    // This is a simplified approach - adjust based on your actual auth setup
    return { hasPassword: false }; // Set to false for social login users
  });

// Server function to delete account
const deleteAccount = createServerFn({ method: "POST" })
  .validator((data: { password?: string; hasPassword: boolean }) => data)
  .handler(async ({ data }) => {
    const headers = getHeaders();
    const session = await auth.api.getSession({
      headers: headers as HeadersInit,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Delete the user account
    if (data.hasPassword && data.password) {
      await auth.api.deleteUser({
        body: {
          password: data.password,
        },
        headers: headers as any,
      });
    } else {
      // For users without password, we might need a different approach
      // This depends on how Better Auth handles social login users
      await auth.api.deleteUser({
        body: {},
        headers: headers as any,
      });
    }

    // Redirect to home page after deletion
    throw redirect({ to: "/" });
  });

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
      .then(result => {
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
      onChange: hasPassword ? deleteWithPasswordSchema : deleteWithoutPasswordSchema,
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
      } catch (error) {
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
      <div className="rounded-lg bg-white shadow-sm mt-6 border-2 border-red-200 p-6">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-sm mt-6 border-2 border-red-200">
      <div className="p-6">
        <h2 className="text-red-900 mb-4 text-lg font-medium">
          Delete Account
        </h2>
        
        <div className="text-gray-600 text-sm mb-4">
          <p className="mb-2">
            <strong className="text-red-600">Warning:</strong> This action is permanent and cannot be undone.
          </p>
          <p>Deleting your account will:</p>
          <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
            <li>Remove all your shortened URLs</li>
            <li>Delete all click analytics data</li>
            <li>Permanently delete your profile information</li>
          </ul>
        </div>

        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex justify-center rounded-md border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            I understand, delete my account
          </button>
        ) : (
          <>
            {message && (
              <div className="mb-4 rounded-lg p-4 bg-red-50 text-red-800 border-red-200 border">
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <form.Field name="confirmation">
                {(field) => (
                  <div>
                    <label htmlFor={field.name} className="text-gray-700 block text-sm font-medium">
                      Type <span className="font-mono font-bold">DELETE</span> to confirm
                    </label>
                    <input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="Type DELETE"
                    />
                    {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {field.state.meta.errors.map((error) => error?.message).join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {hasPassword && (
                <form.Field name="password">
                  {(field) => (
                    <div>
                      <label htmlFor={field.name} className="text-gray-700 block text-sm font-medium">
                        Enter your password to confirm
                      </label>
                      <input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                        placeholder="Enter your password"
                      />
                      {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                        <p className="mt-1 text-sm text-red-600">
                          {field.state.meta.errors.map((error) => error?.message).join(", ")}
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
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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