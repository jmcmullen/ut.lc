import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { auth } from "~/api/auth";

/**
 * Check if the current user has a password-based account
 */
export const checkHasPassword = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getHeaders();
  const session = await auth.api.getSession({
    headers: new Headers(headers as HeadersInit),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check if user has a password account by looking at their account providers
  const accounts = await auth.api.listUserAccounts({
    headers: new Headers(headers as HeadersInit),
  });

  const hasPassword = accounts.some(
    (account: { provider: string }) => account.provider === "credential"
  );
  
  return { hasPassword };
});

/**
 * Update or set user password
 */
export const updatePassword = createServerFn({ method: "POST" })
  .validator((data: { 
    currentPassword?: string;
    newPassword: string;
    isSettingPassword: boolean;
  }) => data)
  .handler(async ({ data }) => {
    const headers = getHeaders();
    const session = await auth.api.getSession({
      headers: new Headers(headers as HeadersInit),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (data.isSettingPassword) {
      // For social login users setting password for the first time
      await auth.api.unlinkAccount({
        body: {
          providerId: "credential",
        },
        headers: new Headers(headers as HeadersInit),
      });
    } else {
      // For users changing existing password
      await auth.api.changePassword({
        body: {
          currentPassword: data.currentPassword!,
          newPassword: data.newPassword,
        },
        headers: new Headers(headers as HeadersInit),
      });
    }

    return { success: true };
  });

/**
 * Update user profile information
 */
export const updateProfile = createServerFn({ method: "POST" })
  .validator(
    (data: {
      name?: string;
      email?: string;
      image?: string;
      currentUser: {
        name?: string;
        email?: string;
        image?: string;
      };
    }) => data,
  )
  .handler(async ({ data }) => {
    const headers = getHeaders();
    const session = await auth.api.getSession({
      headers: new Headers(headers as HeadersInit),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Build update body with only changed values
    const updateBody: Record<string, string> = {};

    if (data.name !== undefined && data.name !== data.currentUser.name) {
      updateBody.name = data.name;
    }

    if (data.email !== undefined && data.email !== data.currentUser.email) {
      updateBody.email = data.email;
    }

    if (data.image !== undefined && data.image !== data.currentUser.image) {
      updateBody.image = data.image;
    }

    // Only call API if there are changes
    if (Object.keys(updateBody).length === 0) {
      return { success: true, message: "No changes to update" };
    }

    await auth.api.updateUser({
      body: updateBody,
      headers: new Headers(headers as HeadersInit),
    });

    return { success: true, emailChanged: updateBody.email !== undefined };
  });

/**
 * Delete the current user's account
 */
export const deleteAccount = createServerFn({ method: "POST" })
  .validator((data: { password?: string; hasPassword: boolean }) => data)
  .handler(async ({ data }) => {
    const headers = getHeaders();
    const session = await auth.api.getSession({
      headers: new Headers(headers as HeadersInit),
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
        headers: new Headers(headers as HeadersInit),
      });
    } else {
      // For users without password (social login only)
      await auth.api.deleteUser({
        body: {},
        headers: new Headers(headers as HeadersInit),
      });
    }

    // Redirect to home page after deletion
    throw redirect({ to: "/" });
  });