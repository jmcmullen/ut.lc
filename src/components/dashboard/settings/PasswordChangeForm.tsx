import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { checkHasPassword, updatePassword } from "~/actions/accountActions";

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
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: (values) => {
        const errors: Record<string, string> = {};

        if (
          hasPassword &&
          (!values.value.currentPassword || values.value.currentPassword.length === 0)
        ) {
          errors.currentPassword = "Current password is required";
        }

        if (!values.value.newPassword || values.value.newPassword.length < 8) {
          errors.newPassword = "Password must be at least 8 characters";
        }

        if (!values.value.confirmPassword || values.value.confirmPassword.length === 0) {
          errors.confirmPassword = "Please confirm your password";
        }

        if (
          values.value.newPassword &&
          values.value.confirmPassword &&
          values.value.newPassword !== values.value.confirmPassword
        ) {
          errors.confirmPassword = "Passwords don't match";
        }

        return Object.keys(errors).length > 0 ? errors : undefined;
      },
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
          text: hasPassword
            ? "Password changed successfully!"
            : "Password set successfully! You can now sign in with your email and password.",
        });

        // Reset form
        data.formApi.reset();

        // If password was just set, update the state
        if (!hasPassword) {
          setHasPassword(true);
        }
      } catch {
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
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg bg-white shadow-sm">
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
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            {hasPassword ? "Change Password" : "Set Password"}
          </h2>

          {!hasPassword && (
            <p className="mb-4 text-sm text-gray-600">
              You signed in with a social provider. Set a password to enable
              email/password login.
            </p>
          )}

          <div className="space-y-4">
            {hasPassword && (
              <form.Field name="currentPassword">
                {(field) => (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter current password"
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
            )}

            <form.Field name="newPassword">
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter new password"
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

            <form.Field name="confirmPassword">
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Confirm new password"
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
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-end">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? hasPassword
                      ? "Changing..."
                      : "Setting..."
                    : hasPassword
                      ? "Change Password"
                      : "Set Password"}
                </button>
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
