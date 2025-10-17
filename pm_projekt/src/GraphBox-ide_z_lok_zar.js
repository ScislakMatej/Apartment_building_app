import React, { useState } from "react";
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

  // Funkcia na načítanie a spracovanie Excel súboru
  const handleFileUpload = (e) => {
    const file = e.target.files[0];  // Získame súbor
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Predpokladáme, že údaje sú v prvom hárku
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Spracovanie dát: extrahovanie mesiacov a stavov na účte
      const months = jsonData.slice(1, 13).map(row => row["Mesiac"]);  // Vyberieme hodnoty od A2 po A13 (0-indexed, takže slice(1, 13))
      const accountBalance = jsonData.slice(1, 13).map(row => row["Stav na ucte"]);  // Získať hodnoty zo stĺpca "Stav na ucte"

      // Nastavenie dát pre bodový graf
      const chartData = {
        datasets: [
          {
            label: 'Stav na účte',
            data: months.map((month, index) => ({
              x: month,  // Mesiac na X-ovej osi
              y: accountBalance[index],  // Stav na účte na Y-ovej osi
            })),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Farba bodov
            borderColor: 'rgba(75, 192, 192, 1)',  // Okraj bodov
            borderWidth: 1,  // Hrúbka okraja
          }
        ],
      };

      setChartData(chartData);  // Nastavenie dát do stavu
    };

    // Čítanie súboru ako binárny
    reader.readAsBinaryString(file);
  };

  return (
    <div className="graph-box">
      <h3>Graf: Stav účtu podľa mesiaca</h3>
      
      {/* Input pre nahratie Excel súboru */}
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload}
      />

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
                max: 2000,  // Max hodnota Y-ovej osi
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
    </div>
  );
};

export default GraphBox;
