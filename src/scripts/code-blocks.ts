/**
 * Docs code blocks: a header with the language and a «Copy» button that gives a
 * little squash + «Copied!» for 1.4 s. Labels come from data-copy / data-copied
 * on the <article>. languageLabel is pure (unit-tested).
 */

const LABELS: Record<string, string> = {
  csharp: 'C#',
  cs: 'C#',
  json: 'JSON',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  powershell: 'PowerShell',
  ps1: 'PowerShell',
  yaml: 'YAML',
  yml: 'YAML',
  xml: 'XML',
};

const PLAIN = new Set(['', 'text', 'plaintext', 'txt', 'plain']);

export function languageLabel(lang?: string): string {
  const key = (lang ?? '').trim().toLowerCase();
  if (PLAIN.has(key)) return '';
  return LABELS[key] ?? key.toUpperCase();
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Clipboard API unavailable (insecure context, permissions): old-school fallback.
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  try {
    document.execCommand('copy');
  } finally {
    area.remove();
  }
}

export function enhanceCodeBlocks(root: ParentNode, labels: { copy: string; copied: string }): void {
  root.querySelectorAll<HTMLPreElement>('.prose pre.astro-code').forEach((pre) => {
    if (pre.parentElement?.classList.contains('code-block')) return;

    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    const head = document.createElement('div');
    head.className = 'code-block__head';
    const lang = document.createElement('span');
    lang.className = 'code-block__lang';
    lang.textContent = languageLabel(pre.dataset.language);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-block__copy';
    button.textContent = labels.copy;

    let timer: number | undefined;
    button.addEventListener('click', async () => {
      await copyText(pre.innerText);
      button.textContent = labels.copied;
      button.classList.remove('is-copied');
      void button.offsetWidth;
      button.classList.add('is-copied');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.textContent = labels.copy;
        button.classList.remove('is-copied');
      }, 1400);
    });

    head.append(lang, button);
    pre.replaceWith(wrap);
    wrap.append(head, pre);
  });
}
