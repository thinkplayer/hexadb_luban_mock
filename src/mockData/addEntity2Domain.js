import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";
import path from "path";
import mockjs from "mockjs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fileName = path.parse(import.meta.url).name;

const mockJson = mockjs.mock({
  displayName: "@cword(8,12)",
  name: "@word(8,12)",
  domainId: "1730519667902590978",
  "attributes|50-500": [
    {
      id: "@id",
      displayName: "@ctitle()",
      name: "@word()",
      "dataType|1": [
        "date",
        "timestamp",
        "varchar",
        "int4",
        "int8",
        "float4",
        "float8",
        "decimal",
        "bool",
        // "char",
        "text",
        "json",
        "xml",
        "bytea",
        // "geometry",
      ],
      description: "@cparagraph(2)",
    },
  ],
});
const data = new Uint8Array(Buffer.from(JSON.stringify(mockJson, null, 2)));
writeFile(path.resolve(__dirname, `${fileName}.json`), data, (err) => {
  if (err) throw err;
});
