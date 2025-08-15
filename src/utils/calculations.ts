// utils/calculations.ts - Using YOUR fantasy calculation function
import { STATS_CONFIG } from './constants';

export const calculateFantasyPoints = (
    rawStats: { [statId: string]: number }, 
    scoringRules: { [statId: string]: any }
): number => {
    let totalPoints = 0;

    Object.entries(rawStats).forEach(([statId, value]) => {
        const scoringRule = scoringRules[statId];
        if (scoringRule && value) {
            totalPoints += STATS_CONFIG.calculateFantasyPoints(statId, value, scoringRule);
        }
    });

    return Math.round(totalPoints * 100) / 100;
};

export const convertStatsForDisplay = (rawStats: { [statId: string]: number }): { [statName: string]: number } => {
    const displayStats: { [statName: string]: number } = {};

    Object.entries(rawStats).forEach(([statId, value]) => {
        const statName = STATS_CONFIG.getStatName(statId);
        if (value !== null && value !== undefined && value !== 0) {
            displayStats[statName] = value;
        }
    });

    return displayStats;
};

// The rest of your calculation functions remain exactly the same
export const calculateConsistency = (weeklyPoints: number[]): number => {
    if (weeklyPoints.length < 2) return 0;

    const mean = weeklyPoints.reduce((sum, pts) => sum + pts, 0) / weeklyPoints.length;
    const variance = weeklyPoints.reduce((sum, pts) => sum + Math.pow(pts - mean, 2), 0) / weeklyPoints.length;
    const standardDeviation = Math.sqrt(variance);

    if (mean === 0) return 0;

    const coefficientOfVariation = standardDeviation / mean;
    return Math.max(0, Math.min(100, 100 - (coefficientOfVariation * 100)));
};

export const calculateVolatility = (weeklyPoints: number[]): number => {
    if (weeklyPoints.length < 2) return 0;

    const mean = weeklyPoints.reduce((sum, pts) => sum + pts, 0) / weeklyPoints.length;
    const variance = weeklyPoints.reduce((sum, pts) => sum + Math.pow(pts - mean, 2), 0) / weeklyPoints.length;
    const standardDeviation = Math.sqrt(variance);

    return mean === 0 ? 0 : standardDeviation / mean;
};

export const calculateBoomBustRates = (
    weeklyPoints: number[]
): { boomRate: number; bustRate: number } => {
    if (weeklyPoints.length === 0) return { boomRate: 0, bustRate: 0 };

    const mean = weeklyPoints.reduce((sum, pts) => sum + pts, 0) / weeklyPoints.length;
    const boomThreshold = mean * 1.5;
    const bustThreshold = mean * 0.5;

    const boomGames = weeklyPoints.filter(pts => pts >= boomThreshold).length;
    const bustGames = weeklyPoints.filter(pts => pts <= bustThreshold).length;

    return {
        boomRate: (boomGames / weeklyPoints.length) * 100,
        bustRate: (bustGames / weeklyPoints.length) * 100
    };
};