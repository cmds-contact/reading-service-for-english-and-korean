import { create } from 'zustand'
import { LayoutMode, Language } from '@/types/content'

interface ReaderState {
  activeParagraphId: string | null
  setActiveParagraph: (id: string | null) => void

  layoutMode: LayoutMode
  setLayoutMode: (mode: LayoutMode) => void

  activeLanguage: Language
  setActiveLanguage: (lang: Language) => void
}

export const useReaderStore = create<ReaderState>((set) => ({
  activeParagraphId: null,
  setActiveParagraph: (id) => set({ activeParagraphId: id }),

  layoutMode: 'side-by-side',
  setLayoutMode: (mode) => set({ layoutMode: mode }),

  activeLanguage: 'en',
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
}))
