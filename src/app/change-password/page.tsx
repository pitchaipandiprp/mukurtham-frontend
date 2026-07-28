"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { ChangePassword } from "@/components/pages/users/change-password";

export default function ChangePasswordPage() {
  useAuthRedirect();

  return <ChangePassword />;
}
