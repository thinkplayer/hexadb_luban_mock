import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";
import path from "path";
import mockjs from "mockjs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fileName = path.parse(import.meta.url).name;

const mockJson = mockjs.mock({
  displayName: "@ctitle(6,9)",
  name: "@word(6,30)",
  ownerId: "1680768588192735233",
  organizationId: "1689188005510873089",
  tagIdList: ["TAG-01"],
  bizSystemId: "1727524019980935169",
  "columnList|5": [
    {
      id: "@id",
      name: "@word(5, 9)",
      displayName: "@cword(6,9)",
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
      dataTypeName: null,
      dataLength: function () {
        let dataLength = undefined;
        switch (this.dataType) {
          case "varchar":
            dataLength = 255;
            break;
          case "decimal":
            dataLength = 16;
            break;
        }
        return dataLength;
      },
      dataPrecision: function () {
        let dataPrecision = undefined;
        switch (this.dataType) {
          case "decimal":
            dataPrecision = 6;
            break;
        }
        return dataPrecision;
      },
      pkFlag: false,
      partitionFlag: false,
      frequentFlag: false,
      notNullFlag: false,
      dataDefault: null,
      description: "@cparagraph(2, 3)",
      anonymizationAutoFlag: false,
      anonymizationRule: null,
      displayOrder: 1,
      masterDataColumnId: null,
      masterDataColumn: null,
      partitionConfigInfo: null,
      attributeId: null,
      distributionFlag: null,
    },
  ],
  distribution: {
    type: "REPLICATION",
  },
  partitionConfig: "",
  dataImportUrl: "",
});

const data = new Uint8Array(Buffer.from(JSON.stringify(mockJson, null, 2)));
writeFile(path.resolve(__dirname, `${fileName}.json`), data, (err) => {
  if (err) throw err;
});
