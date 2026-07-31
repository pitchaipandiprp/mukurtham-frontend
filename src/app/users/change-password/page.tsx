"use client";

import { ChangePassword } from "@/components/pages/users/change-password";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function ChangePasswordPage() {
  useAuthRedirect();

  return <ChangePassword />;
}
