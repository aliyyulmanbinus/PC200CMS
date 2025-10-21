export interface FirebaseObject {
  id: string
  condition: string
  description: string
  objectDisplayName: string
  partNumber: string
}

export type FirebaseObjectInput = Omit<FirebaseObject, "id">
