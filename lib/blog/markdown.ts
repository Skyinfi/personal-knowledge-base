import { Marked, Renderer, type Tokens } from 'marked'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function safeHref(href: string): string | null {
  const value = href.trim()
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    const url = new URL(value)
    if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'mailto:') {
      return value
    }
  } catch {
    return null
  }
  return null
}

class SafeRenderer extends Renderer {
  html({ text }: Tokens.HTML | Tokens.Tag): string {
    return escapeHtml(text)
  }

  image({ text }: Tokens.Image): string {
    return escapeHtml(text)
  }

  link({ href, title, tokens, text }: Tokens.Link): string {
    const rawInner = this.parser.parseInline(tokens)
    const inner = typeof rawInner === 'string' ? rawInner : (text ?? '')
    const safe = safeHref(href)
    if (!safe) return inner
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
    return `<a href="${escapeHtml(safe)}"${titleAttr}>${inner}</a>`
  }
}

for (const prop of ['html', 'image', 'link'] as const) {
  Object.defineProperty(SafeRenderer.prototype, prop, { enumerable: true })
}

const marked = new Marked({ async: false, gfm: true, renderer: new SafeRenderer() })

export function renderMarkdown(source: string): string {
  const html = marked.parse(source)
  if (typeof html !== 'string') throw new Error('Markdown 渲染结果不是字符串。')
  return html
}
