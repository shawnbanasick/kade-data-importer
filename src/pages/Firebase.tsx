import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import NumberInput from "@/components/ui/NumberInput.tsx";
import UserTextInput from "@/components/ui/UserTextInput.tsx";
import JSZip from "jszip";
import { getDateTime } from "./getDateTime.ts";
import DropdownSelect from "@/components/ui/DropdownSelect";

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
  const [lines, setLines] = useState<string>("");

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
    zip.file(`${filename}-${projectName}-all-data.csv`, lines);
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

  function jsonToCsv(data: Record<string, Record<string, unknown>>): string {
    const recordIds = Object.keys(data);
    const dataKeys = Object.keys(data[recordIds[0]]);
    const records = [[...dataKeys]];

    for (const recordId of recordIds) {
      const record = data[recordId];
      const recordValues = dataKeys.map((key) => {
        let tempValue = record[key] ?? "";
        if (Array.isArray(tempValue)) tempValue = tempValue.join("|");
        tempValue = tempValue.toString().replaceAll(",", "|"); // replace commas in values to avoid CSV issues
        return tempValue;
      });
      records.push(recordValues as string[]);
    }
    return records.map((row) => row.join(",")).join("\n");
  }

  const handleLoadJSON = () => {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json"; // Accept only JSON files
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Handle the selected file
        const reader = new FileReader();
        reader.onload = async (event) => {
          const fileContent = event.target?.result;
          const records = Object.entries(JSON.parse(fileContent as string));
          const sorts: string[][] = records.map(([key, value]) => {
            const obj = value as Record<string, unknown>;
            const randomId = String(obj.randomId ?? "").trim();
            const partId = String(obj.partId ?? "").trim();
            const userCode =
              String(obj.urlUserCode ?? "").trim() || "no usercode";
            const sortValues =
              String(obj.sort ?? "")
                .replace(/,+$/, "") // strip trailing commas
                .replace(/,/g, "|") // normalize separators to |
                .split("|") ?? [];
            return [randomId, partId, userCode, ...sortValues];
          });
          setQSorts(sorts);
          // process all data into lines for the final CSV output
          const allLines = jsonToCsv(JSON.parse(fileContent as string));
          setLines(allLines);
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
            {t("Firebase Data Conversion")}
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
              onClick={handleLoadJSON}
              className="inline-flex w-100 items-center justify-center gap-3 px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-shadow shadow cursor-pointer"
            >
              {t("Load Firebase JSON File")}
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
