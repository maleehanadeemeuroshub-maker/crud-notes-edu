import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ breaks: true, gfm: true })

/** Note content is authored as markdown; render + sanitize before ever using dangerouslySetInnerHTML. */
export function renderMarkdown(source: string): string {
  const rawHtml = marked.parse(source, { async: false })
  return DOMPurify.sanitize(rawHtml)
}

const MARKDOWN_SYNTAX_RE = /[#*_`~>]|\[[^\]]*\]\([^)]*\)/g

/** Strips common markdown syntax for compact card previews where full rendering would be noisy. */
export function stripMarkdown(source: string): string {
  return source.replace(MARKDOWN_SYNTAX_RE, '').replace(/\n{2,}/g, ' ').trim()
}
