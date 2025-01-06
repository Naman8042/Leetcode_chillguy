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
                // const data  = {
                //     "totalSolved": 261,
                //     "totalSubmissions": [
                //         {
                //             "difficulty": "All",
                //             "count": 318,
                //             "submissions": 510
                //         },
                //         {
                //             "difficulty": "Easy",
                //             "count": 70,
                //             "submissions": 114
                //         },
                //         {
                //             "difficulty": "Medium",
                //             "count": 221,
                //             "submissions": 356
                //         },
                //         {
                //             "difficulty": "Hard",
                //             "count": 27,
                //             "submissions": 40
                //         }
                //     ],
                //     "totalQuestions": 3406,
                //     "easySolved": 62,
                //     "totalEasy": 846,
                //     "mediumSolved": 180,
                //     "totalMedium": 1775,
                //     "hardSolved": 19,
                //     "totalHard": 785,
                //     "ranking": 383122,
                //     "contributionPoint": 1438,
                //     "reputation": 0,
                //     "submissionCalendar": {
                //         "1705622400": 3,
                //         "1705708800": 1,
                //         "1705795200": 1,
                //         "1705881600": 6,
                //         "1705968000": 2,
                //         "1706054400": 3,
                //         "1706313600": 5,
                //         "1706400000": 1,
                //         "1706486400": 6,
                //         "1706572800": 3,
                //         "1706659200": 2,
                //         "1706745600": 2,
                //         "1706832000": 3,
                //         "1706918400": 2,
                //         "1707004800": 1,
                //         "1707436800": 3,
                //         "1707523200": 1,
                //         "1707696000": 3,
                //         "1707782400": 2,
                //         "1707868800": 4,
                //         "1708128000": 8,
                //         "1708214400": 6,
                //         "1708300800": 5,
                //         "1708387200": 4,
                //         "1708473600": 2,
                //         "1708560000": 2,
                //         "1708646400": 5,
                //         "1708732800": 5,
                //         "1708819200": 1,
                //         "1708905600": 9,
                //         "1708992000": 7,
                //         "1709078400": 2,
                //         "1709164800": 4,
                //         "1709251200": 5,
                //         "1709337600": 4,
                //         "1709424000": 1,
                //         "1709683200": 2,
                //         "1709856000": 2,
                //         "1709942400": 6,
                //         "1710028800": 7,
                //         "1710115200": 2,
                //         "1710201600": 7,
                //         "1710288000": 2,
                //         "1710374400": 6,
                //         "1710460800": 4,
                //         "1710547200": 3,
                //         "1710633600": 1,
                //         "1710720000": 3,
                //         "1710806400": 2,
                //         "1710892800": 7,
                //         "1710979200": 2,
                //         "1711065600": 2,
                //         "1711411200": 1,
                //         "1711497600": 2,
                //         "1711584000": 6,
                //         "1711670400": 1,
                //         "1712707200": 1,
                //         "1713571200": 1,
                //         "1713744000": 5,
                //         "1713830400": 6,
                //         "1713916800": 5,
                //         "1714003200": 1,
                //         "1714176000": 2,
                //         "1714867200": 1,
                //         "1714953600": 4,
                //         "1715040000": 1,
                //         "1715212800": 3,
                //         "1721001600": 2,
                //         "1721088000": 5,
                //         "1721174400": 2,
                //         "1721260800": 1,
                //         "1721347200": 3,
                //         "1721606400": 4,
                //         "1721692800": 1,
                //         "1721779200": 4,
                //         "1721865600": 2,
                //         "1721952000": 2,
                //         "1722038400": 1,
                //         "1722211200": 1,
                //         "1722297600": 1,
                //         "1722384000": 5,
                //         "1722470400": 5,
                //         "1722556800": 1,
                //         "1722643200": 2,
                //         "1722729600": 2,
                //         "1722816000": 1,
                //         "1722902400": 2,
                //         "1723075200": 1,
                //         "1723161600": 1,
                //         "1723248000": 1,
                //         "1723507200": 1,
                //         "1723593600": 2,
                //         "1723766400": 2,
                //         "1724112000": 1,
                //         "1724371200": 1,
                //         "1725148800": 1,
                //         "1725235200": 2,
                //         "1725321600": 3,
                //         "1725408000": 4,
                //         "1725494400": 1,
                //         "1725580800": 5,
                //         "1725667200": 3,
                //         "1725926400": 4,
                //         "1726012800": 4,
                //         "1726099200": 1,
                //         "1726185600": 4,
                //         "1726272000": 2,
                //         "1726444800": 3,
                //         "1726531200": 2,
                //         "1726617600": 3,
                //         "1726704000": 1,
                //         "1726963200": 2,
                //         "1727049600": 3,
                //         "1727136000": 3,
                //         "1727222400": 2,
                //         "1727308800": 1,
                //         "1727395200": 3,
                //         "1727481600": 3,
                //         "1727568000": 1,
                //         "1727740800": 3,
                //         "1727827200": 1,
                //         "1727913600": 1,
                //         "1728000000": 1,
                //         "1728086400": 2,
                //         "1728172800": 1,
                //         "1728259200": 1,
                //         "1728345600": 1,
                //         "1728432000": 1,
                //         "1728518400": 1,
                //         "1728604800": 1,
                //         "1728864000": 1,
                //         "1728950400": 2,
                //         "1729036800": 2,
                //         "1729123200": 1,
                //         "1729209600": 1,
                //         "1729296000": 2,
                //         "1729382400": 1,
                //         "1729728000": 1,
                //         "1729814400": 1,
                //         "1729900800": 1,
                //         "1730160000": 1,
                //         "1730764800": 1,
                //         "1731283200": 2,
                //         "1731369600": 1,
                //         "1731456000": 1,
                //         "1731628800": 2,
                //         "1731888000": 1,
                //         "1731974400": 2,
                //         "1732060800": 1,
                //         "1732233600": 3,
                //         "1732320000": 1,
                //         "1732406400": 1,
                //         "1732492800": 1,
                //         "1732579200": 1,
                //         "1732665600": 2,
                //         "1732752000": 3,
                //         "1732838400": 3,
                //         "1732924800": 1,
                //         "1733011200": 3,
                //         "1733097600": 1,
                //         "1733184000": 4,
                //         "1733270400": 2,
                //         "1733356800": 2,
                //         "1733443200": 1,
                //         "1733529600": 2,
                //         "1733616000": 1,
                //         "1733702400": 2,
                //         "1733788800": 2,
                //         "1733875200": 1,
                //         "1733961600": 1,
                //         "1734048000": 2,
                //         "1734134400": 2,
                //         "1734220800": 1,
                //         "1734307200": 1,
                //         "1734393600": 1,
                //         "1734480000": 1,
                //         "1734566400": 1,
                //         "1734652800": 1,
                //         "1734739200": 1,
                //         "1734825600": 1,
                //         "1734912000": 2,
                //         "1734998400": 2,
                //         "1735084800": 4,
                //         "1735171200": 5,
                //         "1735257600": 2,
                //         "1735344000": 1,
                //         "1735430400": 2,
                //         "1735516800": 1,
                //         "1735603200": 2,
                //         "1735689600": 7,
                //         "1735776000": 5,
                //         "1735862400": 2,
                //         "1735948800": 3
                //     },
                //     "recentSubmissions": [
                //         {
                //             "title": "Minimum Number of Operations to Make Elements in Array Distinct",
                //             "titleSlug": "minimum-number-of-operations-to-make-elements-in-array-distinct",
                //             "timestamp": "1735993466",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Unique Length-3 Palindromic Subsequences",
                //             "titleSlug": "unique-length-3-palindromic-subsequences",
                //             "timestamp": "1735972698",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Unique Length-3 Palindromic Subsequences",
                //             "titleSlug": "unique-length-3-palindromic-subsequences",
                //             "timestamp": "1735971607",
                //             "statusDisplay": "Time Limit Exceeded",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Number of Ways to Split Array",
                //             "titleSlug": "number-of-ways-to-split-array",
                //             "timestamp": "1735880731",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Number of Ways to Split Array",
                //             "titleSlug": "number-of-ways-to-split-array",
                //             "timestamp": "1735880681",
                //             "statusDisplay": "Runtime Error",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Longest Substring Without Repeating Characters",
                //             "titleSlug": "longest-substring-without-repeating-characters",
                //             "timestamp": "1735816617",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Longest Substring Without Repeating Characters",
                //             "titleSlug": "longest-substring-without-repeating-characters",
                //             "timestamp": "1735816582",
                //             "statusDisplay": "Wrong Answer",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Count Special Subsequences",
                //             "titleSlug": "count-special-subsequences",
                //             "timestamp": "1735815865",
                //             "statusDisplay": "Time Limit Exceeded",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Count Vowel Strings in Ranges",
                //             "titleSlug": "count-vowel-strings-in-ranges",
                //             "timestamp": "1735815288",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Count Vowel Strings in Ranges",
                //             "titleSlug": "count-vowel-strings-in-ranges",
                //             "timestamp": "1735812320",
                //             "statusDisplay": "Time Limit Exceeded",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Minimum Size Subarray Sum",
                //             "titleSlug": "minimum-size-subarray-sum",
                //             "timestamp": "1735733767",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Find the Lexicographically Largest String From the Box I",
                //             "titleSlug": "find-the-lexicographically-largest-string-from-the-box-i",
                //             "timestamp": "1735732902",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Find the Lexicographically Largest String From the Box I",
                //             "titleSlug": "find-the-lexicographically-largest-string-from-the-box-i",
                //             "timestamp": "1735732856",
                //             "statusDisplay": "Wrong Answer",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Minimum Operations to Make Columns Strictly Increasing",
                //             "titleSlug": "minimum-operations-to-make-columns-strictly-increasing",
                //             "timestamp": "1735710244",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Minimum Operations to Make Columns Strictly Increasing",
                //             "titleSlug": "minimum-operations-to-make-columns-strictly-increasing",
                //             "timestamp": "1735710195",
                //             "statusDisplay": "Wrong Answer",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Maximum Score After Splitting a String",
                //             "titleSlug": "maximum-score-after-splitting-a-string",
                //             "timestamp": "1735709330",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Maximum Score After Splitting a String",
                //             "titleSlug": "maximum-score-after-splitting-a-string",
                //             "timestamp": "1735709285",
                //             "statusDisplay": "Wrong Answer",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Repeated String Match",
                //             "titleSlug": "repeated-string-match",
                //             "timestamp": "1735648521",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Minimum Cost For Tickets",
                //             "titleSlug": "minimum-cost-for-tickets",
                //             "timestamp": "1735641736",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         },
                //         {
                //             "title": "Count Ways To Build Good Strings",
                //             "titleSlug": "count-ways-to-build-good-strings",
                //             "timestamp": "1735534372",
                //             "statusDisplay": "Accepted",
                //             "lang": "cpp",
                //             "__typename": "SubmissionDumpNode"
                //         }
                //     ],
                //     "matchedUserStats": {
                //         "acSubmissionNum": [
                //             {
                //                 "difficulty": "All",
                //                 "count": 261,
                //                 "submissions": 317
                //             },
                //             {
                //                 "difficulty": "Easy",
                //                 "count": 62,
                //                 "submissions": 80
                //             },
                //             {
                //                 "difficulty": "Medium",
                //                 "count": 180,
                //                 "submissions": 215
                //             },
                //             {
                //                 "difficulty": "Hard",
                //                 "count": 19,
                //                 "submissions": 22
                //             }
                //         ],
                //         "totalSubmissionNum": [
                //             {
                //                 "difficulty": "All",
                //                 "count": 318,
                //                 "submissions": 510
                //             },
                //             {
                //                 "difficulty": "Easy",
                //                 "count": 70,
                //                 "submissions": 114
                //             },
                //             {
                //                 "difficulty": "Medium",
                //                 "count": 221,
                //                 "submissions": 356
                //             },
                //             {
                //                 "difficulty": "Hard",
                //                 "count": 27,
                //                 "submissions": 40
                //             }
                //         ]
                //     }
                // }
                const {data} = await axios.get(`https://leetcode-api-faisalshohag.vercel.app/${id}`)
                console.log(data)
                setTotalSolved(data.totalSolved)
                setTotalSubmissions(data.totalSubmissions[0].submissions)
                setRanking(data.ranking)
                setSubmissionCalendar(data.submissionCalendar)
                setDifficultySolved({
                    easy: data.easySolved, // Adjust based on your API response
                    medium: data.mediumSolved, // Adjust based on your API response
                    hard: data.hardSolved, // Adjust based on your API response
                });
                setContributionPoint(data.contributionPoint)
                setRecentSubmissions(data.recentSubmissions);
                setLoading(false)
                
            }
            catch (err) {
                console.log(err)
                toast.error('Username not found')
            }
        }
        getDetails()
    }, [])

    useEffect(() => {
        if (submissionCalendar) {
            const streak = calculateLongestStreak(submissionCalendar);
            setLongestStreak(streak);
            console.log("Longest Streak: ", streak);
            setChillGuyLevel(calculateChillLevelPercentage(totalSolved,difficultySolved.easy,difficultySolved.medium,difficultySolved.hard,longestStreak))     
        }
    }, [submissionCalendar]);
    if(Loading){
        return(
            <Loader/>
        )
    }
    return (
        <div className='bg-gray-100 min-h-screen p-4 md:px-20'>
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