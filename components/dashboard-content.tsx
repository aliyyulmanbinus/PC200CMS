"use client"

import type { FirebaseObject } from "@/lib/types"
import { Dashboard } from "@/components/dashboard"

interface DashboardContentProps {
  toyota: FirebaseObject[]
  loading: boolean
  onEdit: (object: FirebaseObject) => void
  onDelete: (object: FirebaseObject) => void
}

export function DashboardContent({ toyota, loading, onEdit, onDelete }: DashboardContentProps) {
  return <Dashboard toyota={toyota} loading={loading} onEdit={onEdit} onDelete={onDelete} />
}
