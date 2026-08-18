/**
 * Custom input for productVariant.optionValues[].value
 *
 * When an option is selected (e.g. "Size"), queries all existing values used
 * for that option across other variants and offers them as suggestions in a
 * themed dropdown. Free-text entry is always allowed.
 */
import { useEffect, useRef, useState } from 'react';
import { Box, Card, Stack, Text, TextInput } from '@sanity/ui';
import { set, unset, useClient, useFormValue } from 'sanity';
import type { StringInputProps } from 'sanity';

export function OptionValueInput(props: StringInputProps) {
  const { onChange, value, elementProps } = props;
  const client = useClient({ apiVersion: '2024-01-01' });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive the path to the sibling 'option' reference field in the same array item.
  // props.path for 'value' looks like: ['optionValues', {_key: 'xyz'}, 'value']
  // Sibling path: ['optionValues', {_key: 'xyz'}, 'option']
  const optionPath = [...props.path.slice(0, -1), 'option'];
  const optionRef = useFormValue(optionPath) as { _ref: string } | undefined;

  useEffect(() => {
    if (!optionRef?._ref) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    client
      .fetch<Array<{ optionValues: Array<{ value: string }> }>>(
        `*[_type == "productVariant" && $id in optionValues[].option._ref]{
          "optionValues": optionValues[option._ref == $id]{ value }
        }`,
        { id: optionRef._ref }
      )
      .then((docs) => {
        if (cancelled) return;
        const unique = [
          ...new Set(
            docs
              .flatMap((d) => d.optionValues.map((ov) => ov.value))
              .filter(Boolean)
          ),
        ].sort();
        setSuggestions(unique);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [optionRef?._ref, client]);

  const filtered = suggestions.filter(
    (s) => !value || s.toLowerCase().includes((value as string).toLowerCase())
  );

  return (
    <Box ref={containerRef} style={{ position: 'relative' }}>
      <TextInput
        {...elementProps}
        value={(value as string) ?? ''}
        onChange={(e) => {
          const next = e.currentTarget.value;
          onChange(next ? set(next) : unset());
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        // delay hiding so onMouseDown on a suggestion fires first
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && filtered.length > 0 && (
        <Card
          shadow={2}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 200,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          <Stack>
            {filtered.map((s) => (
              <Box
                key={s}
                as="button"
                padding={3}
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                }}
                onMouseDown={() => {
                  onChange(set(s));
                  setOpen(false);
                }}
              >
                <Text size={1}>{s}</Text>
              </Box>
            ))}
          </Stack>
        </Card>
      )}
    </Box>
  );
}

export default null;
