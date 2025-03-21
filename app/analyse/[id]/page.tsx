import Trophy from '@/assets/trophy.png';
import Accept from '@/assets/accept.png';
import Fire from '@/assets/fire.png';
import Ranking from '@/assets/ranking.png';
import Thunder from '@/assets/thunder.png';
import Image from 'next/image';
import Submissiongraph from '@/app/_component/Submissiongraph';
import Histogram from '@/app/_component/Histogram';
import Chillguy from '@/assets/chill_guy.png';
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

interface PageProps {
    params: {
        id: string;
    };
}


const Page = async ({ params }: PageProps) => {
    const { id } =  params;
    // Fetch data on the server
    const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${id}`);
    const data = await response.json();
    console.log(data)
    const totalSolved = data.totalSolved;
    const totalSubmissions = data.totalSubmissions[0].submissions;
    const ranking = data.ranking;
    const submissionCalendar = data.submissionCalendar;
    const difficultySolved = {
        easy: data.easySolved,
        medium: data.mediumSolved,
        hard: data.hardSolved,
    };
    const contributionPoint = data.contributionPoint;
    const recentSubmissions = data.recentSubmissions;

    const longestStreak = calculateLongestStreak(submissionCalendar);
    const chillGuyLevel = calculateChillLevelPercentage(
        totalSolved,
        difficultySolved.easy,
        difficultySolved.medium,
        difficultySolved.hard,
        longestStreak
    );

    const acceptedSubmissions = recentSubmissions.filter(
        (submission) => submission.statusDisplay === "Accepted"
    );

    return (
        <div className='mt-4 p-4 md:p-20'>
            <ChillGuy Username={id} chillguylevel={chillGuyLevel} />
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
                <div className="w-full md:w-[50%] lg:w-[40%] h-96 bg-white flex flex-col items-center justify-center rounded-md">
                    <h1 className="text-lg lg:text-xl font-bold text-center mb-4">Leetcode Difficulty Distribution</h1>
                    <Histogram data={difficultySolved} />
                </div>
            </div>

            <div className='bg-white p-2 mt-5 w-full sm:w-[59%] rounded-md'>
                <h1 className='text-xl text-center font-bold my-4'>Recent Submissions</h1>
                {acceptedSubmissions.map((recentSubmission, id) => (
                    <div key={id}>
                        <RecentSubmissions title={recentSubmission.title} timestamp={recentSubmission.timestamp} />
                    </div>
                ))}
            </div>
        </div>
    );
}

interface SubmissionProps {
    title: string;
    timestamp: string;
}

interface ChillGuyProps {
    Username: string;
    chillguylevel: number;
}

function ChillGuy({ Username, chillguylevel }: ChillGuyProps) {
    const levelAsPercentage = chillguylevel > 1 ? Math.floor(chillguylevel) : Math.floor(chillguylevel * 100);

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
        <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-50 p-2 py-4 rounded-md gap-2 my-2 text-center sm:text-left">
            <div className="font-medium text-sm sm:text-base">{title}</div>
            <div className="text-gray-600 text-sm sm:text-base">{formattedDate}</div>
        </div>
    );
}

export default Page