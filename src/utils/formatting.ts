// src/utils/formatting.ts - ALL FORMATTING FUNCTIONS
export const formatPlayerName = (name: string): string => {
    if (!name) return 'Unknown Player';

    // Remove special characters and extra whitespace
    return name
        .replace(/[^\w\s\-'\.]/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
};

export const formatStatValue = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return '0';

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) return '0';
    if (numValue === 0) return '0';
    if (numValue % 1 === 0) return numValue.toString();

    return numValue.toFixed(1);
};

export const formatFantasyPoints = (points: number | null | undefined): string => {
    if (points === null || points === undefined) return '0.0';

    const numPoints = typeof points === 'string' ? parseFloat(points) : points;

    if (isNaN(numPoints)) return '0.0';

    return numPoints.toFixed(1);
};

export const formatRank = (rank: number | null | undefined): string => {
    if (!rank || rank === 0) return '#--';
    return `#${rank}`;
};

export const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '0%';

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) return '0%';

    return `${numValue.toFixed(1)}%`;
};

export const formatRecord = (wins: number, losses: number, ties: number = 0): string => {
    if (ties > 0) {
        return `${wins}-${losses}-${ties}`;
    }
    return `${wins}-${losses}`;
};

export const formatTeamName = (teamName: string): string => {
    if (!teamName) return 'Unknown Team';

    // Truncate long team names
    if (teamName.length > 20) {
        return teamName.substring(0, 17) + '...';
    }

    return teamName;
};

export const formatGameTime = (gameTime: string | null | undefined): string => {
    if (!gameTime) return 'TBD';

    try {
        const date = new Date(gameTime);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    } catch (error) {
        return 'TBD';
    }
};

export const formatOpponent = (opponent: string | null | undefined): string => {
    if (!opponent) return '';

    // Handle different opponent formats
    if (opponent.startsWith('@')) {
        return opponent; // Already formatted
    }

    if (opponent.startsWith('vs ')) {
        return opponent; // Already formatted
    }

    // Default to home game
    return `vs ${opponent}`;
};

export const formatInjuryStatus = (status: string | null | undefined): string => {
    if (!status) return '';

    const statusMap: { [key: string]: string } = {
        'O': 'Out',
        'D': 'Doubtful',
        'Q': 'Questionable',
        'P': 'Probable',
        'IR': 'IR',
        'PUP': 'PUP',
        'COV': 'COVID',
        'SUS': 'Suspended'
    };

    return statusMap[status.toUpperCase()] || status;
};

export const getPositionColor = (position: string): string => {
    const positionColors: { [key: string]: string } = {
        'QB': '#3182ce',
        'RB': '#059669',
        'WR': '#d97706',
        'TE': '#dc2626',
        'K': '#6b7280',
        'DST': '#7c3aed',
        'LB': '#8b5cf6',
        'CB': '#06b6d4',
        'S': '#10b981',
        'DE': '#f59e0b',
        'DT': '#ef4444'
    };

    return positionColors[position.toUpperCase()] || '#6b7280';
};

export const getPositionAbbreviation = (position: string): string => {
    const abbreviations: { [key: string]: string } = {
        'QUARTERBACK': 'QB',
        'RUNNING_BACK': 'RB',
        'WIDE_RECEIVER': 'WR',
        'TIGHT_END': 'TE',
        'KICKER': 'K',
        'DEFENSE': 'DST',
        'LINEBACKER': 'LB',
        'CORNERBACK': 'CB',
        'SAFETY': 'S',
        'DEFENSIVE_END': 'DE',
        'DEFENSIVE_TACKLE': 'DT'
    };

    return abbreviations[position.toUpperCase()] || position.toUpperCase();
};

export const getConsistencyDescription = (score: number): string => {
    if (score >= 90) return 'Very Reliable';
    if (score >= 80) return 'Steady Producer';
    if (score >= 70) return 'Fairly Consistent';
    if (score >= 60) return 'Somewhat Volatile';
    return 'Boom or Bust';
};

export const getConsistencyColor = (score: number): string => {
    if (score >= 80) return '#059669'; // Green
    if (score >= 60) return '#d97706'; // Orange
    return '#dc2626'; // Red
};

export const getVolatilityDescription = (index: number): string => {
    if (index <= 0.3) return 'Very Stable';
    if (index <= 0.5) return 'Stable';
    if (index <= 0.7) return 'Moderate';
    if (index <= 1.0) return 'Volatile';
    return 'Highly Volatile';
};

export const getVolatilityColor = (index: number): string => {
    if (index <= 0.5) return '#059669'; // Green
    if (index <= 1.0) return '#d97706'; // Orange
    return '#dc2626'; // Red
};

export const getBoomBustDescription = (boomRate: number, bustRate: number): string => {
    if (boomRate > 30) return 'High Ceiling Player';
    if (bustRate > 30) return 'Risky Floor';
    if (boomRate > 20 && bustRate < 20) return 'Upside Play';
    return 'Balanced Profile';
};

export const getTdDependencyDescription = (dependency: number): string => {
    if (dependency > 50) return 'TD Dependent';
    if (dependency > 30) return 'Moderate TD Reliance';
    if (dependency > 15) return 'Some TD Reliance';
    return 'Volume-Based';
};

export const getTdDependencyColor = (dependency: number): string => {
    if (dependency <= 15) return '#059669'; // Green
    if (dependency <= 30) return '#d97706'; // Orange
    return '#dc2626'; // Red
};

export const formatYearOverYear = (current: number, previous: number): {
    change: number;
    percentage: number;
    description: string;
    color: string;
} => {
    if (previous === 0) {
        return {
            change: current,
            percentage: 0,
            description: 'New',
            color: '#7c3aed'
        };
    }

    const change = current - previous;
    const percentage = (change / previous) * 100;

    let description = 'Stable';
    let color = '#6b7280';

    if (percentage > 10) {
        description = 'Improvement';
        color = '#059669';
    } else if (percentage < -10) {
        description = 'Decline';
        color = '#dc2626';
    }

    return {
        change: Math.round(change * 10) / 10,
        percentage: Math.round(percentage * 10) / 10,
        description,
        color
    };
};

export const formatProjectionConfidence = (confidence: number): string => {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 80) return 'High';
    if (confidence >= 70) return 'Moderate';
    if (confidence >= 60) return 'Low';
    return 'Very Low';
};

export const formatWeeklyTrend = (weeks: number[]): string => {
    if (weeks.length < 2) return 'N/A';

    const recent = weeks.slice(-3);
    const trend = recent[recent.length - 1] - recent[0];

    if (trend > 5) return '↗️ Trending Up';
    if (trend < -5) return '↘️ Trending Down';
    return '➡️ Stable';
};

export const formatMatchupDifficulty = (difficulty: string): {
    label: string;
    color: string;
    description: string;
} => {
    const difficulties: { [key: string]: { label: string; color: string; description: string } } = {
        'ELITE': { label: 'Elite', color: '#059669', description: 'Excellent matchup' },
        'GOOD': { label: 'Good', color: '#10b981', description: 'Favorable matchup' },
        'AVERAGE': { label: 'Average', color: '#d97706', description: 'Neutral matchup' },
        'TOUGH': { label: 'Tough', color: '#dc2626', description: 'Difficult matchup' },
        'BRUTAL': { label: 'Brutal', color: '#991b1b', description: 'Avoid if possible' }
    };

    return difficulties[difficulty.toUpperCase()] || difficulties['AVERAGE'];
};