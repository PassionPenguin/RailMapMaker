import { ContentData } from '@types';

const downloadBlob = (data: BlobPart, type: string, filename: string) => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAsRmg = (content: ContentData, filename: string) => {
  const payload = JSON.stringify(content, null, 2);
  downloadBlob(payload, 'application/json', `${filename}.rmg`);
};

export const exportAsSvg = (svg: SVGSVGElement, filename: string) => {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  downloadBlob(svgString, 'image/svg+xml', `${filename}.svg`);
};

export const exportAsPng = async (
  svg: SVGSVGElement,
  filename: string,
  options: { scale?: number; background?: string } = {}
) => {
  const { scale = 1, background = 'transparent' } = options;
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const svg64 = btoa(unescape(encodeURIComponent(svgString)));
  const image64 = `data:image/svg+xml;base64,${svg64}`;

  const img = new Image();
  const width = svg.viewBox.baseVal.width * scale;
  const height = svg.viewBox.baseVal.height * scale;

  img.src = image64;
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (background !== 'transparent') {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/png');
  downloadBlob(await (await fetch(dataUrl)).blob(), 'image/png', `${filename}.png`);
};
