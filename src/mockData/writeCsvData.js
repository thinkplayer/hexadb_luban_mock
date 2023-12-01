import { createArrayCsvWriter } from "csv-writer";
import path from "path";
import fs from "fs";
import readline from "readline";
import { execSync } from "node:child_process";
import { fileURLToPath } from "url";
import mockjs from "mockjs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fileName = path.parse(import.meta.url).name;

// 执行获取文件路径的Shell命令
const filepath = execSync(
  "osascript -e 'POSIX path of (choose file of type {\"public.comma-separated-values-text\"})'"
)
  .toString()
  .trim();

// 打印所选文件的路径
console.log("选择的文件路径:", filepath);
// 在这里可以继续对文件路径进行其他操作

// 创建可读流
const fileStream = fs.createReadStream(filepath);
// 创建逐行读取接口
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity, // 避免 Windows 行尾符导致问题
});
// 读取第一行作为标题行
rl.once("line", (line) => {
  const headers = line.split(",");
  // 输出标题行
  console.log("CSV Headers:", headers);

  const csvData = [];
  for (let i = 0; i < 6; i++) {
    const mockData = mockjs.mock({
      [`data|${headers.length}`]: ["@word(4,9)"],
    });
    csvData.push(mockData.data);
  }
  const csvWriter = createArrayCsvWriter({
    path: path.resolve(__dirname, `${fileName}.csv`),
    header: headers,
  });
  console.log("csvData: ", csvData);
  csvWriter
    .writeRecords(csvData) // returns a promise
    .then(() => {
      console.log("...Done");
    });

  // 关闭逐行读取接口
  rl.close();
});

// 处理读取错误
rl.on("error", (error) => {
  console.error("Error reading CSV file:", error.message);
});
