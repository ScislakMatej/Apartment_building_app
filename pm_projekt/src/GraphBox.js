import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from "xlsx";  // Načítanie knižnice pre prácu so súbormi Excel
import grafFile from './graf.xlsx'; // Import Excel súboru

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

  // Funkcia na načítanie a spracovanie predvoleného Excel súboru 
  const loadDefaultFile = async () => {
    try {
      // Fetch the Excel file from the server
      const response = await fetch(grafFile);
      const data = await response.arrayBuffer();
      
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Spracovanie dát: extrahovanie mesiacov a stavov na účte
      const months = jsonData.slice(0, 20).map(row => row["Mesiac"].toString());
      const accountBalance = jsonData.slice(0, 20).map(row => row["Stav na ucte"]);

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
            borderWidth: 5,
          }
        ],
      };

      setChartData(chartData); // Nastavenie dát do stavu
    } catch (error) {
      console.error("Chyba pri načítaní Excel súboru:", error);
    }
  };

  // Načítanie predvoleného súboru pri mountnutí komponentu
  useEffect(() => {
    loadDefaultFile();
  }, []);

  return (
    <div className="graph-box">
      {/*
      <h3>Stav účtu</h3>
      */}
      
      {/* Scatter graf */}
      {chartData.datasets && (
        <Scatter
          data={chartData} // Predanie dát do grafu
          options={{
            responsive: true,
            scales: {
              x: {
                type: 'category',
                labels: chartData.datasets[0]?.data.map((dataPoint) => dataPoint.x),
                title: {
                  display: true,
                  text: 'Mesiac',
                },
              },
              y: {
                min: 0,
                max: 2000,
                
                title: {
                  display: true,
                  text: 'Stav na účte',
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
              /*
              title: {
                display: true,
                text: 'Mesiac vs Stav na účte',
              },
              */
            },
          }}
        />
      )}
    </div>
  );
};

export default GraphBox;
