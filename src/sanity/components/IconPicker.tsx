import { useMemo, useState } from 'react';
import type { FC, SVGProps } from 'react';
import { set, unset } from 'sanity';
import type { StringInputProps } from 'sanity';
import {
  Badge,
  Box,
  Card,
  Flex,
  Grid,
  Text,
  TextInput,
  Tooltip,
} from '@sanity/ui';
import * as icons from '@untitledui-pro/icons/line';

type IconComponent = FC<
  SVGProps<SVGSVGElement> & { size?: number; color?: string }
>;

const ICON_NAMES = Object.keys(icons).filter(
  (k) => k !== 'default'
) as (keyof typeof icons)[];

const MAX_VISIBLE = 60;

export function IconPicker(props: StringInputProps) {
  const { value, onChange } = props;
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q
      ? ICON_NAMES.filter((n) => n.toLowerCase().includes(q))
      : ICON_NAMES;
  }, [query]);

  const visible = filtered.slice(0, MAX_VISIBLE);

  function handleSelect(name: string) {
    onChange(value === name ? unset() : set(name));
  }

  const SelectedIcon = value
    ? (icons[value as keyof typeof icons] as IconComponent | undefined)
    : undefined;

  return (
    <Box>
      {/* Search */}
      <TextInput
        placeholder="Search icons…"
        value={query}
        onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
        style={{ marginBottom: 8 }}
      />

      {/* Current selection */}
      {SelectedIcon && (
        <Card padding={3} radius={2} tone="primary" style={{ marginBottom: 8 }}>
          <Flex align="center" gap={3}>
            <SelectedIcon size={20} />
            <Text size={1} weight="semibold">
              {value}
            </Text>
            <Box flex={1} />
            <button
              type="button"
              onClick={() => onChange(unset())}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 4,
                color: 'inherit',
                textDecoration: 'underline',
              }}
            >
              Clear
            </button>
          </Flex>
        </Card>
      )}

      {/* Icon grid */}
      <Card
        border
        radius={2}
        padding={2}
        style={{ maxHeight: 320, overflowY: 'auto' }}
      >
        <Grid columns={[6, 6, 8]} gap={1}>
          {visible.map((name) => {
            const Icon = icons[name] as IconComponent;
            const isSelected = value === name;
            return (
              <Tooltip
                key={name}
                content={
                  <Box padding={2}>
                    <Text size={0}>{name}</Text>
                  </Box>
                }
                placement="top"
                portal
              >
                <Card
                  as="button"
                  type="button"
                  padding={2}
                  radius={2}
                  tone={isSelected ? 'primary' : 'default'}
                  onClick={() => handleSelect(name)}
                  style={{ cursor: 'pointer', border: 'none', width: '100%' }}
                  selected={isSelected}
                >
                  <Flex align="center" justify="center">
                    <Icon size={20} />
                  </Flex>
                </Card>
              </Tooltip>
            );
          })}
        </Grid>
      </Card>

      {/* Overflow hint */}
      {filtered.length > MAX_VISIBLE && (
        <Box marginTop={2}>
          <Badge tone="caution">
            Showing {MAX_VISIBLE} of {filtered.length} — refine your search
          </Badge>
        </Box>
      )}
    </Box>
  );
}
