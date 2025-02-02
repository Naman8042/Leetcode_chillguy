"use client";
import { useParams } from 'next/navigation';
import Trophy from '@/assets/trophy.png';
import Accept from '@/assets/accept.png'
import Fire from '@/assets/fire.png'
import Ranking from '@/assets/ranking.png'
import Thunder from '@/assets/thunder.png'
import Image from 'next/image';
import Submissiongraph from '@/app/_component/Submissiongraph'
import Histogram from '@/app/_component/Histogram';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Chillguy from '@/assets/chill_guy.png'
import { StaticImageData } from 'next/image';

// Props type for the showIcon component
interface IconProps {
    imageSrc: string | StaticImageData; // Supports both static and dynamic images
    label: string;
    value: number | string;
}

const ShowIcon: React.FC<IconProps> = ({ imageSrc, label, value }) => (
    <div className="flex flex-col md:flex-row gap-4 rounded-md justify-center md:justify-between bg-white p-4 md:p-6 border w-full md:w-64 lg:w-64">
        {/* Icon Section */}
        <div className="flex items-center justify-center bg-slate-200 rounded-full h-12 w-12 mx-auto md:mx-0">
            <Image alt={label} src={imageSrc} className="h-6 w-6" />
        </div>

        {/* Label and Value Section */}
        <div className="text-center md:text-left text-base w-full md:w-40">
            {label}
            <br />
            <span className="text-xl font-bold">{value}</span>
        </div>
    </div>
);

interface SubmissionCalendar {
    [key: string]: number; // Define the structure of the calendar data
}



const calculateLongestStreak = (submissionCalendar: Record<string, number> | null): number => {
    if (!submissionCalendar) {
        return 0; // No submissions mean no streak
    }

    // Step 1: Convert timestamps to sorted Date objects
    const dates: Date[] = Object.keys(submissionCalendar)
        .map((timestamp) => new Date(parseInt(timestamp) * 1000)) // Convert to milliseconds
        .sort((a, b) => a.getTime() - b.getTime()); // Sort in ascending order

    // Step 2: Calculate longest streak
    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
        const prevDate = dates[i - 1];
        const currDate = dates[i];

        // Check if current date is consecutive to the previous date
        const differenceInDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (differenceInDays === 1) {
            currentStreak++; // Increment streak
        } else if (differenceInDays > 1) {
            longestStreak = Math.max(longestStreak, currentStreak); // Update longest streak
            currentStreak = 1; // Reset streak
        }
    }

    // Final check for the last streak
    longestStreak = Math.max(longestStreak, currentStreak);

    return longestStreak;
};

function calculateChillLevelPercentage(
    totalSolved: number, 
    easy: number, 
    medium: number, 
    hard: number, 
    streak: number
  ): number {
    
    // Metric 1: Total problems solved (scaled from 0 to 100%)
    const totalSolvedPercentage = Math.min((totalSolved / 500) * 100, 100); // Scale based on totalSolved
  
    // Metric 2: Streak (scaled from 0 to 100%)
    const streakPercentage = Math.min((streak / 20) * 100, 100); // Scale based on streak length
  
    // Metric 3: Difficulty distribution (scaled from 0 to 100%)
    const difficultyPercentage = Math.min((hard / totalSolved) * 100, 100); // How many Hard problems solved
  
    // Combine all metrics (you can adjust weights based on what you value more)
    const weightedScore = (totalSolvedPercentage * 0.5) + (streakPercentage * 0.3) + (difficultyPercentage * 0.2);
  
    return weightedScore; // Chill Guy level percentage
  }
  

interface Submission {
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
    __typename: string;
}


export default function Analyse() {
    const { id } = useParams();
    const[Loading,setLoading] = useState<boolean>(true)
    const [totalSolved, setTotalSolved] = useState<number>(0)
    const [submissionCalendar, setSubmissionCalendar] = useState<SubmissionCalendar | null>(null);
    const [totalSubmissions, setTotalSubmissions] = useState<number>(0)
    const [ranking, setRanking] = useState<number>(0)
    const [longestStreak, setLongestStreak] = useState<number>(0)
    const [contributionPoint, setContributionPoint] = useState<number>(0)
    const [difficultySolved, setDifficultySolved] = useState<{ easy: number; medium: number; hard: number }>({
        easy: 0,
        medium: 0,
        hard: 0,
    });
    const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
    const acceptedSubmissions = recentSubmissions.filter(
        (submission) => submission.statusDisplay === "Accepted"
    );
    const[chillGuyLevel,setChillGuyLevel] = useState<number>(0)
    useEffect(() => {
        async function getDetails() {
            try {
                const { data } = await axios.get(`https://leetcode-api-faisalshohag.vercel.app/${id}`);
                console.log(data);
                setTotalSolved(data.totalSolved);
                setTotalSubmissions(data.totalSubmissions[0].submissions);
                setRanking(data.ranking);
                setSubmissionCalendar(data.submissionCalendar);
                setDifficultySolved({
                    easy: data.easySolved, 
                    medium: data.mediumSolved, 
                    hard: data.hardSolved, 
                });
                setContributionPoint(data.contributionPoint);
                setRecentSubmissions(data.recentSubmissions);
                setLoading(false);
            } catch (err) {
                console.log(err);
                toast.error('Username not found');
            }
        }
        getDetails();
    }, [id]);
    
    useEffect(() => {
        if (submissionCalendar) {
            const streak = calculateLongestStreak(submissionCalendar);
            setLongestStreak(streak);
        }
    }, [submissionCalendar]);
    
    useEffect(() => {
        if (submissionCalendar && longestStreak > 0) {
            const chillLevel = calculateChillLevelPercentage(
                totalSolved,
                difficultySolved.easy,
                difficultySolved.medium,
                difficultySolved.hard,
                longestStreak
            );
            setChillGuyLevel(chillLevel);
        }
    }, [submissionCalendar, longestStreak, totalSolved, difficultySolved]);
    
    if(Loading){
        return(
            <Loader/>
        )
    }
    return (
        <div className=' mt-4 p-4 md:px-20'>
            <ChillGuy Username={id} chillguylevel={chillGuyLevel}/>
            <div className="flex flex-wrap justify-center sm:justify-between w-full items-center gap-4 ">
                <ShowIcon imageSrc={Trophy} label="Total Solved" value={totalSolved} />
                <ShowIcon imageSrc={Accept} label="Total Submissions" value={totalSubmissions} />
                <ShowIcon imageSrc={Fire} label="Longest Streak" value={longestStreak} />
                <ShowIcon imageSrc={Thunder} label="Contribution Point" value={contributionPoint} />
                <ShowIcon imageSrc={Ranking} label="Ranking" value={ranking} />
            </div>

            <div className="flex flex-col md:flex-row justify-between mt-8 gap-6">
                {/* Graph Section */}
                <div className="w-full h-96 md:w-[50%] lg:w-[60%] bg-white flex justify-center items-center p-4 rounded-md">
                    <Submissiongraph submissionCalendar={submissionCalendar} />
                </div>

                {/* Histogram Section */}
                <div className="w-full md:w-[50%] lg:w-[40%] h-96 bg-white flex flex-col items-center justify-center  rounded-md">
                    <h1 className="text-lg lg:text-xl font-bold text-center mb-4">Leetcode Difficulty Distribution</h1>
                    <Histogram data={difficultySolved} />
                </div>
            </div>

            <div className='bg-white p-2 mt-5 w-full sm:w-[59%] rounded-md'>
                <h1 className='text-xl text-center font-bold my-4'>Recent Submissions</h1>
                {
                    acceptedSubmissions && acceptedSubmissions.map((recentSubmission, id) => (
                        <div key={id} className=''>
                            <RecentSubmissions title={recentSubmission.title} timestamp={recentSubmission.timestamp} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

interface SubmissionProps {
    title: string;
    timestamp: string;
}

interface ChillGuyProps { 
    Username: string | string[] | undefined;
    chillguylevel: number; 
  }
  
  function ChillGuy({ Username, chillguylevel }: ChillGuyProps) {
    // Convert the chillguylevel to a percentage (if needed)
    let levelAsPercentage = 0;

  if (chillguylevel > 1) {
    // If it's a raw score (like 2755), you can directly display it or normalize
    levelAsPercentage = Math.floor(chillguylevel); // Simply display the level without multiplication
  } else {
    // If it's a percentage between 0 and 1 (like 0.85), multiply by 100
    levelAsPercentage = Math.floor(chillguylevel * 100);
  }
    return (
      <div className="flex flex-col justify-between items-center bg-white my-5 rounded-md p-5 border">
        <Image alt="" src={Chillguy} className="md:w-80 md:h-80 h-72 w-72" />
        <h1 className="text-2xl font-semibold font-mono text-gray-500 my-5">{Username}</h1>
        <h1 className="text-2xl font-bold">Your Chill Guy Level</h1>
        <h1 className="text-5xl md:text-6xl font-semibold font-mono my-2">{levelAsPercentage}%</h1>
      </div>
    );
  }
  

  

function RecentSubmissions({ title, timestamp }: SubmissionProps) {
    const date = new Date(Number(timestamp) * 1000);  // Convert to date
    const formattedDate = date.toLocaleDateString();  // Format the date

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-50 p-2 py-4 rounded-md  gap-2 my-2 text-center sm:text-left">
            <div className="font-medium text-sm sm:text-base">{title}</div>
            <div className="text-gray-600 text-sm sm:text-base">{formattedDate}</div>
        </div>

    )
}

function Loader() {
    return (

        <div className='flex items-center justify-center min-h-screen'>
            <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
        </div>

    )
}