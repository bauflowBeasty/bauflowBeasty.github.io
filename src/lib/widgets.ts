/**
 * Official store widgets (iframes). Variant names and sizes come from the
 * Asset Store Link Maker (api.assetstore.unity3d.com/affiliate/link-maker) and
 * from itch.io's "Embed game" widget.
 */

export type Theme = 'dark' | 'light';

type Frame = { src: string; width: number; height: number };

/** Asset Store package widget: 'wide' 600×130 for desktop, 'narrow' 202×260 for small screens. */
export function unityWidget(packageId: string, theme: Theme, size: 'wide' | 'narrow'): Frame {
  const variant = (size === 'wide' ? 'widget-wide' : 'widget') + (theme === 'light' ? '-light' : '');
  const [width, height] = size === 'wide' ? [600, 130] : [202, 260];
  return { src: `https://assetstore.unity.com/linkmaker/embed/package/${packageId}/${variant}`, width, height };
}

/** itch.io game widget, 552×167. */
export function itchWidget(gameId: string, theme: Theme): Frame {
  const dark = theme === 'dark' ? '&dark=true' : '';
  return { src: `https://itch.io/embed/${gameId}?linkback=true${dark}`, width: 552, height: 167 };
}
