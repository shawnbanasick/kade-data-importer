import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import NumberInput from "@/components/ui/NumberInput.tsx";
import UserTextInput from "@/components/ui/UserTextInput.tsx";
import JSZip from "jszip";
import { getDateTime } from "./getDateTime.ts";
import DropdownSelect from "@/components/ui/DropdownSelect";
import Papa from "papaparse";

export default function About() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [statementFileContent, setStatementFileContent] = useState<string[]>(
    [],
  );
  const [pattern, updatePattern] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [filename, setFilename] = useState("myProject");
  const [qSorts, setQSorts] = useState<string[][]>([]);
  const [participantIDType, setParticipantIDType] = useState("random ID");
  const [lines, setLines] = useState<string[]>([]);

  const projectName = getDateTime();

  const handleChange = (val: number, i: number) => {
    const newPattern = [...pattern];
    newPattern[i] = val;
    updatePattern(newPattern);
  };

  const handleFilenameChange = (val: string) => {
    setFilename(val);
    console.log("Updated filename:", val);
  };

  const handleDownload = () => {
    const finalSorts = qSorts.map((row: string[]) => {
      const getID = (row: string[]) => {
        if (participantIDType === "random ID") return row[0];
        if (participantIDType === "participant ID") return row[1];
        if (participantIDType === "URL usercode") return row[2];
        return row[0];
      };
      return [getID(row), ...row.slice(3)]; // adjust index based on how many ID columns you have
    });
    const zip = new JSZip();
    zip.file(
      "sorts.txt",
      finalSorts.map((row) => row.join(",")).join("\n") + "\n",
    );
    zip.file("names.txt", filename);
    zip.file("statements.txt", statementFileContent.join("\n") + "\n");
    zip.file("pattern.txt", pattern.join(",") + "\n");
    zip.file(
      `${filename}-${projectName}-all-data.csv`,
      lines.join("\n") + "\n",
    );
    zip.generateAsync({ type: "blob" }).then((content) => {
      const element = document.createElement("a");
      element.href = URL.createObjectURL(content);
      element.download = `${filename}-${projectName}-SIM-26.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  };

  const label: string[] = [
    "-6",
    "-5",
    "-4",
    "-3",
    "-2",
    "-1",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ];

  const handleLoadCSV = () => {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv"; // Accept only CSV files
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Handle the selected file
        const reader = new FileReader();
        reader.onload = async (event) => {
          const data = event.target?.result as string;

          // Copy and Parse the data
          const newData = JSON.parse(JSON.stringify(data));
          const newDataArray2 = Papa.parse(newData);

          const newDataArray3 = JSON.parse(JSON.stringify(newDataArray2.data));
          newDataArray3.shift(); // remove header line

          // conver | in string to commas
          const textLines = newDataArray3.map((row: string[]) => {
            const text = row[0].split("|");
            return text;
          });

          setLines(textLines);
          const partIdArray = [];
          const urlUsercodeArray = [];
          const randomIdArray = [];
          const netlifySortsArray = [];

          for (let i = 1; i < newDataArray2.data.length; i++) {
            // Get participant sorts
            if (newDataArray2.data[i][0].length > 50) {
              const string1 = newDataArray2.data[i][0].split("| sort:|");
              const sortArray2 = string1[1].split("|");
              let sortArray = sortArray2.map((item: string) => {
                // return parseInt(item, 10);
                return item.trim();
              });

              sortArray = sortArray.filter((a) => !isNaN(a));

              const split2 = string1[0].split("| urlUsercode:|");

              // Get url usercode
              const split3 = split2[1].split("|");
              const urlUsercode = split3[0].trim();
              urlUsercodeArray.push(urlUsercode);

              // Get randomId
              const split4 = split2[0].split("| randomId:|");
              const randomId = split4[1].trim();
              randomIdArray.push(randomId);

              // Get partId
              const split5 = split4[0].split("| partId:|");
              let partId = split5[1].trim();
              if (partId === "") {
                partId = "not-set";
              }
              partIdArray.push(partId);
              // add sorts to array
              netlifySortsArray.push([
                randomId,
                partId,
                urlUsercode,
                ...sortArray,
              ]);
            }
          }
          setQSorts(netlifySortsArray);
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };

  const handleLoadStatements = () => {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt"; // Accept only text files
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Handle the selected file
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target?.result as string;
          // Process the file content as needed
          const dataArray = fileContent
            .split(/[\r\n]+/)
            .map((line) => line.trim())
            .filter(Boolean);
          setStatementFileContent(dataArray);
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-rose-50 flex items-center justify-center p-6">
      <main className="w-full h-full overflow-hidden max-w-6xl bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12">
        <header className="flex items-center gap-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
            {t("Netlify CSV Data Conversion")}
          </h1>

          <div className="ml-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-3 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-shadow shadow cursor-pointer"
            >
              {t("back")}
            </button>
          </div>
        </header>

        <section className="mt-8 mb-8 items-center h-full grid gap-6 md:grid-cols-1">
          <div className="flex flex-row gap-8 p-6 bg-linear-to-br from-white to-sky-50 w-full rounded-xl border border-white/60 shadow-sm">
            <p className="text-2xl">1.</p>
            <button
              onClick={handleLoadStatements}
              className="inline-flex w-100 items-center justify-center gap-3 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-shadow shadow cursor-pointer"
            >
              {t("Load Statements Text File")}
            </button>
          </div>
          <div className="flex flex-row gap-8 p-6 bg-linear-to-br from-white to-sky-50 w-full rounded-xl border border-white/60 shadow-sm">
            <p className="text-2xl">2.</p>
            <button
              onClick={handleLoadCSV}
              className="inline-flex w-100 items-center justify-center gap-3 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-shadow shadow cursor-pointer"
            >
              {t("Load Netlify File")}
            </button>
          </div>
          <div
            id="decideLableDiv"
            className="flex w-full overflow-x-auto mt-10 justify-left ml-6 text-2xl items-center gap-2"
          >
            3. &nbsp;&nbsp;&nbsp;&nbsp;Input Number of Statements in Each Column
          </div>
          <div className="flex flex-wrap w-full overflow-auto bg-white border border-slate-200 rounded-xl shadow-sm p-2">
            <div className="flex flex-wrap bg-white border border-slate-200 rounded-xl shadow-sm p-2 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {pattern.map((value, i) => (
                  <NumberInput
                    key={i}
                    label={label[i]}
                    value={value}
                    onChange={(val) => handleChange(val, i)}
                    min={0}
                    max={127}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex w-full overflow-x-auto mt-10 justify-center items-center gap-2">
            <UserTextInput
              filename={filename}
              onChange={handleFilenameChange}
              placeholder="Project filename..."
              width="w-full"
              label="Filename"
            />
          </div>
          <div className="flex flex-row gap-2 p-6 bg-linear-to-br from-white to-sky-50 w-full rounded-xl border border-white/60 shadow-sm">
            <p className="text-2xl">
              5. &nbsp;&nbsp;&nbsp;Select Participant ID
            </p>
            <DropdownSelect
              options={["random ID", "participant ID", "URL usercode"]}
              value={participantIDType}
              onChange={(val) => {
                setParticipantIDType(val);
              }}
            />
          </div>
          <div className="flex flex-row gap-8 p-6 bg-linear-to-br from-white to-sky-50 w-full rounded-xl border border-white/60 shadow-sm">
            <p className="text-2xl">6.</p>
            <button
              onClick={handleDownload}
              className="inline-flex w-100 items-center justify-center gap-3 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-shadow shadow cursor-pointer"
            >
              {t("Download KADE Zip File")}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
