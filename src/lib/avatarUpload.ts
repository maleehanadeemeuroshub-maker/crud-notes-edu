import { supabase } from '@/lib/supabaseClient'

const MAX_SOURCE_SIZE_BYTES = 4 * 1024 * 1024
const TARGET_SIZE = 256

function resizeToSquareBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Only image files can be used as an avatar.'))
      return
    }
    if (file.size > MAX_SOURCE_SIZE_BYTES) {
      reject(new Error('Image is too large (max 4MB).'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not decode the selected image.'))
      img.onload = () => {
        const side = Math.min(img.width, img.height)
        const sx = (img.width - side) / 2
        const sy = (img.height - side) / 2

        const canvas = document.createElement('canvas')
        canvas.width = TARGET_SIZE
        canvas.height = TARGET_SIZE
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Image processing is not supported in this browser.'))
          return
        }
        ctx.drawImage(img, sx, sy, side, side, 0, 0, TARGET_SIZE, TARGET_SIZE)
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not process image.'))), 'image/jpeg', 0.85)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

/** Uploads (or replaces) the signed-in user's avatar in the `avatars` storage bucket and returns its public URL. */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const blob = await resizeToSquareBlob(file)
  const path = `${userId}/avatar.jpg`

  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, blob, {
    upsert: true,
    contentType: 'image/jpeg',
    cacheControl: '0',
  })
  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  // Cache-bust so the new avatar shows immediately everywhere it's rendered.
  return `${data.publicUrl}?t=${Date.now()}`
}
