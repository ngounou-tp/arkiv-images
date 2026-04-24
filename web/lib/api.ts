export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ObjectItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  s3Key?: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchObjects(): Promise<ObjectItem[]> {
  const res = await fetch(`${API_URL}/objects`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch objects');
  return res.json();
}

export async function fetchObject(id: string): Promise<ObjectItem> {
  const res = await fetch(`${API_URL}/objects/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Object not found');
  return res.json();
}

export async function createObject(formData: FormData): Promise<ObjectItem> {
  const res = await fetch(`${API_URL}/objects`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create object');
  }
  return res.json();
}

export async function deleteObject(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/objects/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete object');
}
