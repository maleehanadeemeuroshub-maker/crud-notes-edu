const MAX_SOURCE_SIZE_BYTES = 4 * 1024 * 1024 // 4MB upload guard
const MAX_DIMENSION = 1000 // downscale large photos before storing as a data URL

/** Reads an image File, downscales it, and returns a data URL — this is a demo app with no file storage backend. */
export function fileToDataUrl(file: File): Promise<{ dataUrl: string; size: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Only image files can be attached.'))
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
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Image processing is not supported in this browser.'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
        resolve({ dataUrl, size: Math.round((dataUrl.length * 3) / 4) })
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
