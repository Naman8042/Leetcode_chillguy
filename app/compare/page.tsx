'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ProfileResult {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    longestStreak: number;
    chillGuyLevel: number;
}


export default function Compare() {
    const [profiles, setProfiles] = useState<string[]>(['']);
    const [results, setResults] = useState<ProfileResult[]>([]);
    const [loadingStates, setLoadingStates] = useState<boolean[]>([]);

    const addProfile = () => {
        if (profiles.length < 5) {
            setProfiles([...profiles, '']);
        }
    };

    const updateProfile = (index: number, value: string) => {
        const updatedProfiles = [...profiles];
        updatedProfiles[index] = value;
        setProfiles(updatedProfiles);
    };

    const removeProfile = (index: number) => {
        const updatedProfiles = profiles.filter((_, i) => i !== index);
        setProfiles(updatedProfiles);
        const updatedResults = results.filter((_, i) => i !== index);
        const updatedLoadingStates = loadingStates.filter((_, i) => i !== index);
        setResults(updatedResults);
        setLoadingStates(updatedLoadingStates);
    };

    const fetchDetails = async (username: string, index: number) => {
        try {
            setLoadingStates((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
            });

            const { data } = await axios.get(`https://leetcode-api-faisalshohag.vercel.app/${username}`);
            const longestStreak = calculateLongestStreak(data.submissionCalendar);
            const chillGuyLevel = calculateChillLevelPercentage(
                data.totalSolved,
                data.easySolved,
                data.mediumSolved,
                data.hardSolved,
                longestStreak
            );

            setResults((prev) => {
                const updated = [...prev];
                updated[index] = { ...data, longestStreak, chillGuyLevel };
                return updated;
            });

            setLoadingStates((prev) => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
            });
        } catch (err) {
            console.error(err);
            toast.error(`Failed to fetch data for ${username}`);
            setLoadingStates((prev) => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
            });
        }
    };

    const handleCompare = () => {
        profiles.forEach((profile, index) => {
            if (profile.trim()) {
                fetchDetails(profile, index);
            } else {
                toast.error(`Profile ${index + 1} is empty`);
            }
        });
    };

    return (
        <div className="flex flex-col items-center py-8 px-4 bg-gray-50 mt-1 min-h-screen">
            <h1 className="text-3xl md:text-4xl font-bold text-center">Compare Leetcode Profiles</h1>
            <p className="text-sm md:text-lg my-6 text-gray-600 text-center">
            Compare up to 5 LeetCode profiles to see who&apos;s the chillest coder!

            </p>
            <div className="w-full max-w-2xl flex flex-col gap-4 items-center justify-center mt-5 rounded-md bg-white p-4 sm:p-6">
                {profiles.map((profile, index) => (
                    <div key={index} className="flex flex-row gap-2 w-full items-center">
                        <input
                            type="text"
                            value={profile}
                            onChange={(e) => updateProfile(index, e.target.value)}
                            placeholder="Enter Your Leetcode Username"
                            className="flex-grow border p-2 text-sm md:text-base rounded-md outline-none"
                        />
                        {profiles.length > 1 && (
                            <button
                                onClick={() => removeProfile(index)}
                                className=" font-bold"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                {profiles.length < 5 && (
                    <button
                        onClick={addProfile}
                        className="w-full p-2 bg-blue-100 hover:bg-blue-200 rounded-md font-semibold text-sm md:text-base"
                    >
                        + Add Profile
                    </button>
                )}
                <button
                    onClick={handleCompare}
                    className="w-full p-2 bg-black text-white rounded-md font-semibold text-sm md:text-base"
                >
                    Compare Users
                </button>
            </div>
            <div className="w-full max-w-4xl mt-10 overflow-x-auto">
                <table className="w-full bg-white rounded-md shadow-md">
                    <thead>
                        <tr className="bg-gray-200 text-left text-xs md:text-sm">
                            <th className="p-4">Username</th>
                            <th className="p-4">Total Solved</th>
                            <th className="p-4">Longest Streak</th>
                            <th className="p-4">Chill Guy Level (%)</th>
                            <th className="p-4">Ranking</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr
                                key={index}
                                className={`border-b text-xs md:text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                            >
                                {loadingStates[index] ? (
                                    <td colSpan={5} className="p-4 text-center">
                                        Loading data for {profiles[index]}...
                                    </td>
                                ) : result ? (
                                    <>
                                        <td className="p-4 font-bold">{profiles[index]}</td>
                                        <td className="p-4">{result.totalSolved}</td>
                                        <td className="p-4">{result.longestStreak} days</td>
                                        <td className="p-4">{Math.floor(result.chillGuyLevel)}%</td>
                                        <td className="p-4">{result.ranking}</td>
                                    </>
                                ) : (
                                    <td colSpan={5} className="p-4 text-center">
                                        No data available for {profiles[index]}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Helper functions
const calculateLongestStreak = (submissionCalendar: Record<string, number> | null): number => {
    if (!submissionCalendar) return 0;
    const dates: Date[] = Object.keys(submissionCalendar)
        .map((timestamp) => new Date(parseInt(timestamp) * 1000))
        .sort((a, b) => a.getTime() - b.getTime());

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
        const differenceInDays = (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
        if (differenceInDays === 1) {
            currentStreak++;
        } else if (differenceInDays > 1) {
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1;
        }
    }

    return Math.max(longestStreak, currentStreak);
};

const calculateChillLevelPercentage = (
    totalSolved: number,
    easy: number,
    medium: number,
    hard: number,
    streak: number
): number => {
    const totalSolvedPercentage = Math.min((totalSolved / 500) * 100, 100);
    const streakPercentage = Math.min((streak / 20) * 100, 100);
    const difficultyPercentage = Math.min((hard / totalSolved) * 100, 100);
    return totalSolvedPercentage * 0.5 + streakPercentage * 0.3 + difficultyPercentage * 0.2;
};
