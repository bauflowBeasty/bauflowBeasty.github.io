// PostToolUse hook: recuerda a Claude actualizar PROJECT_MAP.md
// cuando una herramienta pudo haber cambiado la estructura del proyecto.
let d = '';
process.stdin.on('data', (c) => (d += c));
process.stdin.on('end', () => {
  let j;
  try {
    j = JSON.parse(d);
  } catch {
    return;
  }
  const tool = j.tool_name || '';
  const input = j.tool_input || {};
  let reason = '';

  if (tool === 'Write') {
    const f = String(input.file_path || '');
    const ignored =
      /PROJECT_MAP\.md$|CLAUDE\.md$/i.test(f) ||
      /node_modules|[\\/]dist[\\/]|scratchpad|[\\/]\.claude[\\/]settings/i.test(f) ||
      !/BeastyDocumentationPage/i.test(f);
    if (!ignored) reason = `Write sobre ${f}`;
  } else if (tool === 'Bash' || tool === 'PowerShell') {
    const cmd = String(input.command || '');
    if (
      /\b(rm|mv|rmdir|del|mkdir|touch|cp|Remove-Item|Move-Item|Rename-Item|New-Item|Copy-Item)\b/i.test(cmd) &&
      !/node_modules|scratchpad/i.test(cmd)
    ) {
      reason = 'comando de shell que puede haber creado, movido o eliminado archivos';
    }
  }

  if (!reason) return;
  console.log(
    JSON.stringify({
      suppressOutput: true,
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: `[PROJECT_MAP] Se detectó ${reason}. Si este cambio agregó, movió, renombró o eliminó archivos/carpetas del proyecto, actualiza PROJECT_MAP.md ahora mismo (estructura + fecha de «Última actualización»). Si no cambió la estructura, ignora este aviso.`,
      },
    })
  );
});
