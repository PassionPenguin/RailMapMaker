import { CSSProperties } from 'react';

const kebabToCamel = (input: string) => input.replace(/-([a-z])/g, (_, c) => (c ? c.toUpperCase() : '')) as keyof CSSProperties;

export function styleStringToObject(style?: string): CSSProperties {
  if (!style) return {};
  return style
    .split(';')
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<CSSProperties>((acc, decl) => {
      const [rawProp, rawVal] = decl.split(':');
      if (!rawProp || !rawVal) return acc;
      const key = kebabToCamel(rawProp.trim());
      acc[key] = rawVal.trim() as string;
      return acc;
    }, {});
}
