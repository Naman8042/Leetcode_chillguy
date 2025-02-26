"use client"
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary components for the Pie chart
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface PieChartProps {
  data: { easy: number; medium: number; hard: number };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Define the chart data
  const chartData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [data.easy, data.medium, data.hard], // Values for Easy, Medium, Hard
        backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], // Colors for each section
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'], // Hover colors
      },
    ],
  };

  // Define chart options (for customizing the pie chart)
  

  return (
    <div className="w-full h-80 sm:w-[60%] bg-white p-4 rounded-md flex justify-center items-center">
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
