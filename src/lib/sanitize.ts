import "server-only";
import sanitizeHtml from "sanitize-html";
import { descriptionToHtml, htmlToText } from "./rich-text";

const options: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "em", "u", "s", "h2", "h3", "ul", "ol", "li", "blockquote", "a", "hr"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: (tag, attribs) => ({
      tagName: "a",
      attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" },
    }),
    h1: "h2",
    h4: "h3",
    h5: "h3",
    h6: "h3",
  },
};

// Làm sạch HTML từ trình soạn thảo: chỉ giữ các thẻ định dạng an toàn.
export function sanitizeDescription(input: string): string {
  const clean = sanitizeHtml(descriptionToHtml(input), options)
    .replace(/(<p>\s*<\/p>)+$/, "")
    .trim();
  return htmlToText(clean) === "" && !/<hr/.test(clean) ? "" : clean;
}
