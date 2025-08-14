
export const FormatUtils = {
    getStatValue(player, statName, showFantasyStats, currentScoringRules, calculateFantasyPoints) {
        const rawValue = player.stats[statName] || 0;

        if (!showFantasyStats) {
            return rawValue;
        }

        if (!currentScoringRules || Object.keys(currentScoringRules).length === 0) {
            return rawValue;
        }

        try {
            return calculateFantasyPoints(statName, rawValue);
        } catch (error) {
            console.error(`Error calculating fantasy points:`, error);
            return rawValue;
        }
    },

    formatStatValue(value, stat, isFantasyMode = false) {
        if (isFantasyMode && value > 0) {
            return `${value} pts`;
        }

        if (typeof value === 'number') {
            if (value % 1 !== 0) {
                return value.toFixed(1);
            }
        }

        return value.toString();
    }
};
