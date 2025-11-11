"use client"

import type { FirebaseObject } from "@/lib/types"
import { Dashboard } from "@/components/dashboard"

interface DashboardContentProps {
  toyotas: FirebaseObject[]
  loading: boolean
  onEdit: (object: FirebaseObject) => void
  onDelete: (object: FirebaseObject) => void
}

export function DashboardContent({ toyotas, loading, onEdit, onDelete }: DashboardContentProps) {
  return <Dashboard toyotas={toyotas} loading={loading} onEdit={onEdit} onDelete={onDelete} />
}
