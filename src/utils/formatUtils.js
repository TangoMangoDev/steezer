export class FormatUtils {
    static formatStatValue(value, stat, isFantasyMode = false) {
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

    static getStatValue(player, statName, showFantasyStats, scoringRules, calculateFantasyPoints) {
        const rawValue = player.stats[statName] || 0;

        if (!showFantasyStats) {
            return rawValue;
        }

        if (!scoringRules || Object.keys(scoringRules).length === 0) {
            return rawValue;
        }

        try {
            return calculateFantasyPoints(statName, rawValue);
        } catch (error) {
            console.error(`Error calculating fantasy points:`, error);
            return rawValue;
        }
    }
}