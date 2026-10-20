// Reads the mock hospital roster .docx, extracts its text/table content,
// and sends it to Claude for analysis.
//
// Usage:
//   node scripts/send-roster-to-claude.mjs [path/to/file.docx]
//
// Auth: relies on the standard Anthropic credential resolution
// (ANTHROPIC_API_KEY env var, or an `ant auth login` profile) — see
// https://docs.claude.com for details. No key is hardcoded here.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import JSZip from 'jszip'
import Anthropic from '@anthropic-ai/sdk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DEFAULT_DOCX_PATH = path.join(
  __dirname,
  '..',
  'sample-data',
  'Hospital_ED_Roster_Sept2026_MOCK.docx',
)

// ---------------------------------------------------------------------------
// TODO(you): Replace this with the actual instructions you want to give
// Claude about the roster (e.g. "extract every shift into structured JSON",
// "flag scheduling conflicts", "identify the ambiguous name collision and
// how you'd resolve it", etc).
// ---------------------------------------------------------------------------
const INSTRUCTIONS = `TODO: write your instructions for Claude here.`

/**
 * Extracts a plain-text rendering of a .docx file's content, including
 * table rows/cells, by reading word/document.xml out of the docx zip and
 * stripping WordprocessingML markup. This is a lightweight extraction
 * (not a full OOXML parser) — good enough for feeding document text to an
 * LLM, but swap in a fuller library (e.g. mammoth) if you need richer
 * fidelity (styles, images, etc).
 */
async function extractTextFromDocx(docxPath) {
  const buffer = await fs.readFile(docxPath)
  const zip = await JSZip.loadAsync(buffer)
  const documentXmlFile = zip.file('word/document.xml')
  if (!documentXmlFile) {
    throw new Error(`"${docxPath}" doesn't look like a valid .docx (missing word/document.xml)`)
  }
  const xml = await documentXmlFile.async('string')

  const text = xml
    .replace(/<w:tab\/>/g, '\t')
    .replace(/<\/w:tc>/g, ' | ')
    .replace(/<\/w:tr>/g, '\n')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .split('\n')
    .map((line) => line.replace(/\s+\|\s+$/, '').trimEnd())
    .filter((line, i, lines) => !(line === '' && lines[i - 1] === ''))
    .join('\n')
    .trim()

  return text
}

async function main() {
  const docxPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : DEFAULT_DOCX_PATH

  console.log(`Reading ${docxPath} ...`)
  const documentText = await extractTextFromDocx(docxPath)

  const client = new Anthropic()

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high' },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here is the content of a hospital department roster document:\n\n${documentText}`,
          },
          {
            type: 'text',
            text: INSTRUCTIONS,
          },
        ],
      },
    ],
  })

  for (const block of response.content) {
    if (block.type === 'text') {
      console.log(block.text)
    }
  }
}

main().catch((err) => {
  console.error('Failed to send roster to Claude:', err)
  process.exitCode = 1
})
