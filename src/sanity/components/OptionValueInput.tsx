/**
 * Custom input for productVariant.optionValues[].value
 *
 * When an option is selected (e.g. "Size"), queries all existing values used
 * for that option across other variants and offers them as datalist suggestions.
 * Free-text entry is always allowed — this is non-blocking autocomplete.
 */
import { useEffect, useId, useState } from 'react';
import { TextInput } from '@sanity/ui';
import { set, unset, useClient, useFormValue } from 'sanity';
import type { StringInputProps } from 'sanity';

export function OptionValueInput(props: StringInputProps) {
  const { onChange, value, elementProps } = props;
  const client = useClient({ apiVersion: '2024-01-01' });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const uid = useId();

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

  const listId = `option-value-suggestions-${uid.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <>
      <TextInput
        {...elementProps}
        list={suggestions.length > 0 ? listId : undefined}
        value={value ?? ''}
        onChange={(e) => {
          const next = e.currentTarget.value;
          onChange(next ? set(next) : unset());
        }}
      />
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </>
  );
}

export default null;
