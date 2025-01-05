import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SubmissionCalendar {
  [key: string]: number;
}

interface QuestionSubmissionChartProps {
  submissionCalendar: SubmissionCalendar | null;
}

const QuestionSubmissionChart: React.FC<QuestionSubmissionChartProps> = ({ submissionCalendar }) => {
  const [dataLimit, setDataLimit] = useState(20); // Default to 20 days

  // Adjust the data limit based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDataLimit(6); // Show only 6 days on small screens
      } else {
        setDataLimit(20); // Show 20 days on larger screens
      }
    };

    // Set initial limit based on current screen size
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!submissionCalendar) {
    return <p>No data available to display the chart.</p>;
  }

  // Transform the submissionCalendar data
  const transformedData = Object.entries(submissionCalendar).map(([timestamp, count]) => ({
    date: new Date(Number(timestamp) * 1000),
    count,
  }));

  // Sort by date
  transformedData.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get the last `dataLimit` days of data
  const limitedData = transformedData.slice(-dataLimit);

  // Format date as "Dec 5"
  const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const labels = limitedData.map((data) => dateFormatter.format(data.date));

  // Prepare counts for the chart
  const counts = limitedData.map((data) => data.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Questions Submitted",
        data: counts,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.3, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to scale dynamically
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          font: {
            size: 12, // Adjust font size for mobile
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14, // Adjust font size for mobile
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
          font: {
            size: 14, // Adjust font size for mobile
          },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-64 sm:h-80 lg:h-96">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default QuestionSubmissionChart;
