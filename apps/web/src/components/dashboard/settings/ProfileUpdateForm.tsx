import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { updateProfile } from "~/actions/accountActions";
import { useSession } from "~/utils/auth-client";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Invalid URL").or(z.literal("")),
});

interface ProfileUpdateFormProps {
  user: {
    name?: string;
    email?: string;
    image?: string | null;
    createdAt: Date;
    emailVerified: boolean;
  };
}

export function ProfileUpdateForm({ user }: ProfileUpdateFormProps) {
  const session = useSession();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm({
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? "",
    },
    validators: {
      onChange: profileSchema,
    },
    onSubmit: async (data) => {
      setMessage(null);

      try {
        const result = await updateProfile({
          data: {
            name: data.value.name,
            email: data.value.email,
            image: data.value.image,
            currentUser: {
              name: user.name,
              email: user.email,
              image: user.image ?? undefined,
            },
          },
        });

        if (result.message === "No changes to update") {
          setMessage({
            type: "success",
            text: "No changes to update",
          });
          return;
        }

        setMessage({
          type: "success",
          text: result.emailChanged
            ? "Profile updated! Please check your email to verify your new address."
            : "Profile updated successfully!",
        });

        // Refresh session data
        void session.refetch();
      } catch {
        setMessage({
          type: "error",
          text: "Failed to update profile. Please try again.",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  };

  return (
    <div className="rounded-lg bg-white shadow-sm">
      {message && (
        <div
          className={`mb-6 rounded-lg p-4 ${
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
          <h2 className="mb-4 text-lg font-medium text-gray-900">Profile Information</h2>

          <div className="space-y-4">
            <form.Field name="name">
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your name"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-600 mt-1 text-sm">
                      {field.state.meta.errors
                        .map(
                          (error) => (error as unknown as { message: string }).message,
                        )
                        .join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-600 mt-1 text-sm">
                      {field.state.meta.errors
                        .map(
                          (error) => (error as unknown as { message: string }).message,
                        )
                        .join(", ")}
                    </p>
                  )}
                  {field.state.value !== user.email && (
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="text-amber-600">
                        ⚠️ Changing your email will require re-verification
                      </span>
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="image">
              {(field) => (
                <div>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-600 mt-1 text-sm">
                      {field.state.meta.errors
                        .map(
                          (error) => (error as unknown as { message: string }).message,
                        )
                        .join(", ")}
                    </p>
                  )}
                  {field.state.value && (
                    <div className="mt-2">
                      <img
                        src={field.state.value}
                        alt="Profile preview"
                        className="h-20 w-20 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
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
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              )}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
