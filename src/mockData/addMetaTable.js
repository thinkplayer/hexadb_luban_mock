import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";
import path from "path";
import mockjs from "mockjs";
import { fileURLToPath } from "url";
import { createArrayCsvWriter } from "csv-writer";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fileName = path.parse(import.meta.url).name;

const csvData = [];
const csvHeader = [];
const csvHeaderType = [];

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
      distributionFlag: function () {
        csvHeader.push(this.name);
        function getMockData() {
          return mockjs.mock({
            date: '@date("yyyy-MM-dd")',
            timestamp: '@time("HH:mm:ss")',
            varchar: "@title",
            int4: "@int",
            int8: "@int",
            float4: "float4",
            float8: "float8",
            decimal: "decimal",
            bool: "bool",
            // "char":"char",
            text: "text",
            json: "json",
            xml: "xml",
            bytea: "bytea",
            // "geometry": "geometry",
          });
        }
        // TODO 通过 i 控制要生成的csv数据量
        for (let i = 0; i < 3; i++) {
          csvData[i] = csvData[i] ? csvData[i] : [];
          csvData[i].push(getMockData()[this.dataType]);
        }
        csvHeaderType.push(this.dataType);
        return null;
      },
    },
  ],
  distribution: {
    type: "REPLICATION",
  },
  partitionConfig: "",
  dataImportUrl: "",
});

/** 生成新增数据表json */
const data = new Uint8Array(Buffer.from(JSON.stringify(mockJson, null, 2)));
writeFile(path.resolve(__dirname, `${fileName}.json`), data, (err) => {
  if (err) throw err;
});

console.log("csvHeaderType: ", csvHeaderType);

/** 生成对应的csv 文件 */
const csvWriter = createArrayCsvWriter({
  path: path.resolve(__dirname, `${fileName}.csv`),
  header: csvHeader,
});
csvWriter
  .writeRecords(csvData) // returns a promise
  .then(() => {
    console.log(`写入${fileName}.csv文件成功`);
  });
