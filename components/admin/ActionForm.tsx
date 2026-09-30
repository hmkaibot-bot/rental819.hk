"use client";

import { useRouter } from "next/navigation";

/**
 * A plain <form action> whose server action is followed by router.refresh().
 * The action already redirects back to the page with a fresh render; the
 * extra refresh guarantees the block can never be left showing a stale copy
 * of the record (the operator saw just-saved fields come back blank until a
 * manual reload).
 */
export default function ActionForm({
  action,
  className,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <form
      className={className}
      action={async (formData) => {
        await action(formData);
        router.refresh();
      }}
    >
      {children}
    </form>
  );
}
