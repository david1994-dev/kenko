const HTML_TAG = /<\/?(p|br|ul|ol|li|h[1-6]|strong|em|u|s|a|blockquote|hr)\b/i;

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Mô tả cũ là văn bản thường (xuống dòng bằng \n); chuyển thành đoạn văn để hiển thị và sửa.
export function descriptionToHtml(text: string): string {
  if (!text.trim()) return "";
  if (HTML_TAG.test(text)) return text;
  return text
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
