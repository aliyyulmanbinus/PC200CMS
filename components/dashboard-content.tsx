"use client"

import type { FirebaseObject } from "@/lib/types"
import { Dashboard } from "@/components/dashboard"

interface DashboardContentProps {
  objects: FirebaseObject[]
  loading: boolean
  onEdit: (object: FirebaseObject) => void
  onDelete: (object: FirebaseObject) => void
}

export function DashboardContent({ objects, loading, onEdit, onDelete }: DashboardContentProps) {
  return <Dashboard objects={objects} loading={loading} onEdit={onEdit} onDelete={onDelete} />
}
