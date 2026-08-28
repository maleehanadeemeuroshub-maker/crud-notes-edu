import type { ReactNode } from 'react'

export type CodeLanguage = 'sql' | 'javascript' | 'json' | 'rest'

const SQL_KEYWORDS =
  /\b(SELECT|INSERT|INTO|VALUES|UPDATE|SET|DELETE|FROM|WHERE|ORDER|BY|GROUP|LIMIT|OFFSET|AND|OR|NOT|NULL|LIKE|JOIN|ON|AS|DESC|ASC|IN|COUNT|DISTINCT|TABLE|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|NOW)\b/g

const JS_KEYWORDS =
  /\b(async|await|function|const|let|var|return|throw|new|if|else|try|catch|import|export|from|default|class|extends|typeof|of|in)\b/g

const HTTP_METHODS = /\b(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/g

interface Token {
  text: string
  type: 'keyword' | 'string' | 'number' | 'comment' | 'punctuation' | 'key' | 'method' | 'plain'
}

const TOKEN_STYLES: Record<Token['type'], string> = {
  keyword: 'text-indigo-400 font-medium',
  string: 'text-emerald-400',
  number: 'text-amber-300',
  comment: 'text-white/35 italic',
  punctuation: 'text-white/50',
  key: 'text-sky-400',
  method: 'text-emerald-400 font-semibold',
  plain: 'text-white/85',
}

function tokenizeGeneric(line: string, keywordRegex: RegExp | null, commentPrefix: string | null): Token[] {
  const tokens: Token[] = []
  const pattern = /(".*?"|'.*?'|`.*?`)|(\b\d+(\.\d+)?\b)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  const commentIndex = commentPrefix ? line.indexOf(commentPrefix) : -1
  const codePart = commentIndex >= 0 ? line.slice(0, commentIndex) : line
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : ''

  while ((match = pattern.exec(codePart))) {
    if (match.index > lastIndex) {
      tokens.push(...highlightKeywords(codePart.slice(lastIndex, match.index), keywordRegex))
    }
    if (match[1]) tokens.push({ text: match[1], type: 'string' })
    else if (match[2]) tokens.push({ text: match[2], type: 'number' })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < codePart.length) {
    tokens.push(...highlightKeywords(codePart.slice(lastIndex), keywordRegex))
  }
  if (commentPart) tokens.push({ text: commentPart, type: 'comment' })

  return tokens
}

function highlightKeywords(text: string, keywordRegex: RegExp | null): Token[] {
  if (!keywordRegex) return [{ text, type: 'plain' }]
  const tokens: Token[] = []
  let lastIndex = 0
  keywordRegex.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = keywordRegex.exec(text))) {
    if (match.index > lastIndex) tokens.push({ text: text.slice(lastIndex, match.index), type: 'plain' })
    tokens.push({ text: match[0], type: 'keyword' })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) tokens.push({ text: text.slice(lastIndex), type: 'plain' })
  return tokens
}

function tokenizeJsonLine(line: string): Token[] {
  const tokens: Token[] = []
  const pattern = /("(?:[^"\\]|\\.)*")(\s*:)?|(\btrue\b|\bfalse\b|\bnull\b)|(-?\b\d+(\.\d+)?\b)|([{}[\],:])/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(line))) {
    if (match.index > lastIndex) tokens.push({ text: line.slice(lastIndex, match.index), type: 'plain' })
    if (match[1]) {
      tokens.push({ text: match[1], type: match[2] ? 'key' : 'string' })
      if (match[2]) tokens.push({ text: match[2], type: 'punctuation' })
    } else if (match[3]) {
      tokens.push({ text: match[3], type: 'keyword' })
    } else if (match[4]) {
      tokens.push({ text: match[4], type: 'number' })
    } else if (match[6]) {
      tokens.push({ text: match[6], type: 'punctuation' })
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < line.length) tokens.push({ text: line.slice(lastIndex), type: 'plain' })
  return tokens
}

function tokenizeRestLine(line: string): Token[] {
  const methodMatch = HTTP_METHODS.exec(line)
  HTTP_METHODS.lastIndex = 0
  if (methodMatch && line.trimStart().startsWith(methodMatch[0])) {
    const rest = line.slice(methodMatch.index + methodMatch[0].length)
    return [{ text: methodMatch[0], type: 'method' }, { text: rest, type: 'plain' }]
  }
  if (/^\s*→/.test(line)) {
    return [{ text: line, type: 'keyword' }]
  }
  if (line.trimStart().startsWith('{') || line.trimStart().startsWith('"') || line.trimStart().startsWith('[')) {
    return tokenizeJsonLine(line)
  }
  return [{ text: line, type: 'plain' }]
}

function tokenizeLine(line: string, language: CodeLanguage): Token[] {
  switch (language) {
    case 'sql':
      return tokenizeGeneric(line, SQL_KEYWORDS, '--')
    case 'javascript':
      return tokenizeGeneric(line, JS_KEYWORDS, '//')
    case 'json':
      return tokenizeJsonLine(line)
    case 'rest':
      return tokenizeRestLine(line)
    default:
      return [{ text: line, type: 'plain' }]
  }
}

export function highlightCode(code: string, language: CodeLanguage): ReactNode {
  const lines = code.split('\n')
  return lines.map((line, i) => (
    <div key={i}>
      {line.length === 0 ? (
        ' '
      ) : (
        tokenizeLine(line, language).map((token, j) => (
          <span key={j} className={TOKEN_STYLES[token.type]}>
            {token.text}
          </span>
        ))
      )}
    </div>
  ))
}
