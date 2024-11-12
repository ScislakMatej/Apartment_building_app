import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from "xlsx";  // Načítanie knižnice pre prácu so súbormi Excel

// Registrácia potrebných komponentov pre Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const GraphBox = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true); // Stav načítania súboru

  // Azure Blob Storage konfigurácia
  const containerName = "expenses-graph"; // Názov kontajnera
  const blobName = "graf.xlsx"; // Názov súboru na Azure Storage
  const accountName = "pmprojectstorage"; // Názov vášho účtu Azure

  // Zadajte SAS URL generovanú v Azure Portal alebo cez SDK
  const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?se=2026-01-01T00%3A00%3A00Z&sp=r&sv=2022-11-02&sr=b&sig=qdO04qfRakp7CquSm87LXC%2BiUwzVxbi9qu80j8vJ6zc%3D`;

  useEffect(() => {
    const fetchDataFromAzure = async () => {
      try {
        setLoading(true);

        // Načítanie Excel súboru pomocou SAS URL
        const response = await fetch(sasUrl);
        const arrayBuffer = await response.arrayBuffer();  // Získanie dát zo SAS URL ako arrayBuffer

        // Spracovanie Excel súboru
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Spracovanie dát: extrahovanie mesiacov a stavov na účte
        const months = jsonData.slice(1, 13).map(row => row["Mesiac"]);
        const accountBalance = jsonData.slice(1, 13).map(row => row["Stav na ucte"]);

        // Nastavenie dát pre bodový graf
        const chartData = {
          datasets: [
            {
              label: 'Stav na účte',
              data: months.map((month, index) => ({
                x: month,
                y: accountBalance[index],
              })),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }
          ],
        };

        setChartData(chartData);  // Nastavenie dát do stavu
      } catch (error) {
        console.error("Chyba pri načítavaní súboru z Azure:", error);
      } finally {
        setLoading(false); // Nastavíme loading na false, keď sa načítavanie dokončí
      }
    };

    fetchDataFromAzure(); // Načítanie dát pri prvom renderovaní komponentu
  }, []);

  return (
    <div className="graph-box">
      <h3>Graf: Stav účtu podľa mesiaca</h3>

      {loading ? (
        <p>Načítavam dáta...</p> // Zobraziť text počas načítavania dát
      ) : (
        <>
          {/* Scatter graf */}
          {chartData.datasets && (
            <Scatter
              data={chartData}  // Predanie dát do grafu
              options={{
                responsive: true,
                scales: {
                  x: {
                    type: 'category',  // Nastavenie typu osi X ako kategóriu
                    labels: chartData.datasets[0]?.data.map((dataPoint) => dataPoint.x), // Použijeme hodnoty mesiacov ako štítky X-ovej osi
                    title: {
                      display: true,
                      text: 'Mesiac',  // Názov X-ovej osi
                    },
                  },
                  y: {
                    min: 0,  // Min hodnota Y-ovej osi (začína od 0)
                    max: 5000,  // Max hodnota Y-ovej osi
                    title: {
                      display: true,
                      text: 'Stav na účte',  // Názov Y-ovej osi
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',  // Pozícia legendy
                  },
                  title: {
                    display: true,
                    text: 'Mesiac vs Stav na účte',  // Titulok grafu
                  },
                },
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GraphBox;
