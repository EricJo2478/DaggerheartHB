import type Feature from "./Feature";
import type { FeatureVariablePair } from "./Types";

export async function copyToClipboard(str: string) {
  try {
    await navigator.clipboard.writeText(str);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

export function convertMdToHtml(
  features: Feature[],
  variables: FeatureVariablePair[]
) {
  const htmlify = (s: string) => {
    return s
      .replace(/\*\*{1,2}(.*?)\*\*{1,2}/g, "<strong>$1</strong>")
      .replace(/\*{1,2}(.*?)\*{1,2}/g, "<i>$1</i>");
  };
  let val = [];
  for (const feature of features) {
    val.push(
      <p
        key={feature.getId()}
        dangerouslySetInnerHTML={{
          __html:
            "<strong>" +
            feature.getDisplayName(variables) +
            ": </strong>" +
            htmlify(feature.getDescription(variables)),
        }}
      ></p>
    );
  }
  return val;
}

export function downloadData(
  name: string,
  data: any,
  mimeType: string = "text/plain"
) {
  const dataBlob = new Blob([data], { type: mimeType });
  const blobURL = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = blobURL;
  link.download = name;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(blobURL);
}
