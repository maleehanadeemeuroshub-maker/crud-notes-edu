import { useState } from 'react'
import { storage } from '@/utils/storage'

export function useLocalStorageState<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => storage.get(key, initial))

  function update(next: T) {
    setValue(next)
    storage.set(key, next)
  }

  return [value, update]
}
