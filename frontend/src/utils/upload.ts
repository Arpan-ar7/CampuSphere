// Checks a chosen file BEFORE uploading: right type, not too big.
// Returns an error message to show, or '' if the file is fine.
// (The backend must check again — this only saves the student a failed upload.)
import { UPLOAD } from '@/config'

export function checkUploadFile(file: File | null): string {
  if (!file) return 'Please choose a file.'
  if (!UPLOAD.allowedTypes.includes(file.type)) return 'Only PDF, Word documents and images (PNG, JPG, WEBP) can be uploaded.'
  if (file.size > UPLOAD.maxSizeMB * 1024 * 1024) return `That file is too big. The limit is ${UPLOAD.maxSizeMB} MB.`
  return ''
}
