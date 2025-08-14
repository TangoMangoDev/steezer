import { STATS_CONFIG } from '../config/statsConfig.js';

export class FantasyCalculator {
    static calculateFantasyPoints(statName, rawStatValue, scoringRules) {
        if (!rawStatValue || rawStatValue === 0) {
            return rawStatValue || 0;
        }

        if (!scoringRules || Object.keys(scoringRules).length === 0) {
            return rawStatValue || 0;
        }

        const statId = Object.keys(STATS_CONFIG.STAT_ID_MAPPING).find(id => 
            STATS_CONFIG.STAT_ID_MAPPING[id].name === statName
        );

        if (!statId || !scoringRules[statId]) {
            return rawStatValue || 0;
        }

        return STATS_CONFIG.calculateFantasyPoints(statId, rawStatValue, scoringRules[statId]);
    }

    static calculateTotalFantasyPoints(player, scoringRules) {
        if (!player.rawStats) {
            return 0;
        }

        if (!scoringRules || Object.keys(scoringRules).length === 0) {
            return 0;
        }

        let totalPoints = 0;

        try {
            Object.entries(player.rawStats).forEach(([statId, statValue]) => {
                if (scoringRules[statId] && statValue !== 0) {
                    const rule = scoringRules[statId];

                    let points = statValue * parseFloat(rule.points || 0);

                    if (rule.bonuses && Array.isArray(rule.bonuses)) {
                        rule.bonuses.forEach(bonusRule => {
                            const target = parseFloat(bonusRule.bonus.target || 0);
                            const bonusPoints = parseFloat(bonusRule.bonus.points || 0);

                            if (statValue >= target && target > 0) {
                                const bonusesEarned = Math.floor(statValue / target);
                                points += bonusesEarned * bonusPoints;
                            }
                        });
                    }

                    if (points !== 0) {
                        totalPoints += points;
                    }
                }
            });

            return Math.round(totalPoints * 100) / 100;
        } catch (error) {
            console.error(`Error calculating total fantasy points:`, error);
            return 0;
        }
    }

    static getBonusPoints(player, statName, scoringRules) {
        if (!scoringRules || !player.rawStats) {
            return 0;
        }

        const statId = Object.keys(STATS_CONFIG.STAT_ID_MAPPING).find(id => 
            STATS_CONFIG.STAT_ID_MAPPING[id].name === statName
        );

        if (!statId || !scoringRules[statId]) {
            return 0;
        }

        const rule = scoringRules[statId];
        const rawValue = player.rawStats[statId] || 0;

        if (!rule.bonuses || !Array.isArray(rule.bonuses) || rawValue === 0) {
            return 0;
        }

        let totalBonusPoints = 0;

        rule.bonuses.forEach((bonusRule) => {
            const target = parseFloat(bonusRule.bonus.target || 0);
            const bonusPoints = parseFloat(bonusRule.bonus.points || 0);

            if (target > 0 && rawValue >= target) {
                const bonusesEarned = Math.floor(rawValue / target);
                totalBonusPoints += bonusesEarned * bonusPoints;
            }
        });

        return Math.round(totalBonusPoints * 100) / 100;
    }

    static getBonusTarget(statName, scoringRules) {
        if (!scoringRules) return '';

        const statId = Object.keys(STATS_CONFIG.STAT_ID_MAPPING).find(id => 
            STATS_CONFIG.STAT_ID_MAPPING[id].name === statName
        );

        if (!statId || !scoringRules[statId]) return '';

        const rule = scoringRules[statId];
        if (!rule.bonuses || !Array.isArray(rule.bonuses) || rule.bonuses.length === 0) return '';

        return rule.bonuses[0].bonus.target || '';
    }

    static hasBonusRule(statName, scoringRules) {
        if (!scoringRules) return false;

        const statId = Object.keys(STATS_CONFIG.STAT_ID_MAPPING).find(id => 
            STATS_CONFIG.STAT_ID_MAPPING[id].name === statName
        );

        if (!statId || !scoringRules[statId]) return false;

        const rule = scoringRules[statId];
        return rule.bonuses && Array.isArray(rule.bonuses) && rule.bonuses.length > 0;
    }
}