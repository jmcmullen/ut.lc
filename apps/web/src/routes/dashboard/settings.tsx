import { createFileRoute } from "@tanstack/react-router";
import { AccountDeletionForm } from "~/components/dashboard/settings/AccountDeletionForm";
import { ApiKeyManager } from "~/components/dashboard/settings/ApiKeyManager";
import { PasswordChangeForm } from "~/components/dashboard/settings/PasswordChangeForm";
import { ProfileUpdateForm } from "~/components/dashboard/settings/ProfileUpdateForm";
import { getUser } from "~/utils/auth-server";

export const Route = createFileRoute("/dashboard/settings")({
  loader: async () => {
    const user = await getUser();
    if (!user) {
      throw new Error("Unauthorized");
    }
    return { user };
  },
  component: SettingsComponent,
});

function SettingsComponent() {
  const { user } = Route.useLoaderData();

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account settings and profile information
        </p>
      </div>

      <ProfileUpdateForm user={user} />

      <PasswordChangeForm />

      <ApiKeyManager />

      <AccountDeletionForm />
    </section>
  );
}
