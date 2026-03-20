"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingState from "@/components/LoadingState";

const POLL_INTERVAL_MS = 3000;
const TIMEOUT_MS = 120000; // 2 minutes

export default function AuditReportPolling({ auditId }: { auditId: string }) {
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, POLL_INTERVAL_MS);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setTimedOut(true);
    }, TIMEOUT_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [auditId, router]);

  return <LoadingState timedOut={timedOut} />;
}
