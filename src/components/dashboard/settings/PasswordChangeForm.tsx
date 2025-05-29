import { useForm } from "@tanstack/react-form";
import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import React, { useState } from "react";
import { z } from "zod";
import { auth } from "~/api/auth/auth";

// Validation schemas for different scenarios
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const setPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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

    // Check if user has a password account
    const accounts = await auth.api.listAccounts({
      userId: session.user.id,
      headers: headers as any,
    });

    const hasPassword = accounts.some(account => account.providerId === "credential");
    return { hasPassword };
  });

// Server function to change or set password
const updatePassword = createServerFn({ method: "POST" })
  .validator((data: { 
    currentPassword?: string;
    newPassword: string;
    isSettingPassword: boolean;
  }) => data)
  .handler(async ({ data }) => {
    const headers = getHeaders();
    const session = await auth.api.getSession({
      headers: headers as HeadersInit,
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (data.isSettingPassword) {
      // For social login users setting password for the first time
      await auth.api.linkAccount({
        body: {
          providerId: "credential",
          password: data.newPassword,
        },
        headers: headers as any,
      });
    } else {
      // For users changing existing password
      await auth.api.changePassword({
        body: {
          currentPassword: data.currentPassword!,
          newPassword: data.newPassword,
        },
        headers: headers as any,
      });
    }

    return { success: true };
  });

export function PasswordChangeForm() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
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
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: hasPassword ? changePasswordSchema : setPasswordSchema,
    },
    onSubmit: async (data) => {
      setMessage(null);

      try {
        await updatePassword({
          data: {
            currentPassword: hasPassword ? data.value.currentPassword : undefined,
            newPassword: data.value.newPassword,
            isSettingPassword: !hasPassword,
          },
        });

        setMessage({
          type: "success",
          text: hasPassword ? "Password changed successfully!" : "Password set successfully! You can now sign in with your email and password.",
        });

        // Reset form
        data.formApi.reset();
        
        // If password was just set, update the state
        if (!hasPassword) {
          setHasPassword(true);
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: hasPassword 
            ? "Failed to change password. Please check your current password and try again."
            : "Failed to set password. Please try again.",
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
      <div className="rounded-lg bg-white shadow-sm mt-6 p-6">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-sm mt-6">
      {message && (
        <div
          className={`m-6 mb-0 rounded-lg p-4 ${
            message.type === "success"
              ? "border border-green-200 bg-green-50 text-green-800"
              : "bg-red-50 text-red-800 border-red-200 border"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <h2 className="text-gray-900 mb-4 text-lg font-medium">
            {hasPassword ? "Change Password" : "Set Password"}
          </h2>
          
          {!hasPassword && (
            <p className="text-gray-600 text-sm mb-4">
              You signed in with a social provider. Set a password to enable email/password login.
            </p>
          )}

          <div className="space-y-4">
            {hasPassword && (
              <form.Field name="currentPassword">
                {(field) => (
                  <div>
                    <label htmlFor={field.name} className="text-gray-700 block text-sm font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter current password"
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

            <form.Field name="newPassword">
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="text-gray-700 block text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter new password"
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors.map((error) => error?.message).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="text-gray-700 block text-sm font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Confirm new password"
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      {field.state.meta.errors.map((error) => error?.message).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <div className="border-gray-200 border-t pt-4">
          <div className="flex justify-end">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (hasPassword ? "Changing..." : "Setting...") : (hasPassword ? "Change Password" : "Set Password")}
                </button>
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}