/**
 * CommandLine.tsx — Bottom `:cmd` bar. Pressing `:` focuses it (mode → COMMAND,
 * yellow pill); Enter runs the command with a green ✓ flash then switches buffer;
 * Esc cancels. Live autocomplete hint shows the nearest matching command.
 */
import { useEffect, useRef, useState } from 'react';
import { useNvim } from './nvim-context';

export function CommandLine() {
  const { commandOpen, openCommand, closeCommand, runCmd, cmdMap, data } = useNvim();
  const [value, setValue] = useState('');
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandOpen) inputRef.current?.focus();
    else setValue('');
  }, [commandOpen]);

  const match = value ? Object.keys(cmdMap).find((k) => k.startsWith(value.toLowerCase())) : '';
  const defaultHint = data.strings.nvim_cmd_hint ?? 'type : for command · f find · t terminal · q back';

  const submit = () => {
    const val = value;
    setFlash(true);
    window.setTimeout(() => {
      setFlash(false);
      const ok = runCmd(val);
      if (!ok) closeCommand();
      setValue('');
      inputRef.current?.blur(); // re-enable global vim keybindings
    }, 140);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
    else if (e.key === 'Escape') { e.preventDefault(); closeCommand(); }
    else if (e.key === 'Tab' && match) { e.preventDefault(); setValue(match); }
  };

  return (
    <div
      className={`panel cmdline${flash ? ' ok' : ''}`}
      onClick={openCommand}
      role="form"
      aria-label="Command line"
    >
      <span className="prompt">{commandOpen || flash ? ':' : ' '}</span>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKey}
        onFocus={openCommand}
        onBlur={() => !flash && closeCommand()}
        autoComplete="off"
        spellCheck={false}
        aria-label="Enter command"
      />
      {commandOpen && match && match !== value.toLowerCase() ? (
        <span className="hint" aria-live="polite">:{match}</span>
      ) : (
        <span className="hint">{defaultHint}</span>
      )}
    </div>
  );
}
