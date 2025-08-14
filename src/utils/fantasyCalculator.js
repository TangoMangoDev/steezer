export const FantasyCalculator = {
    calculateFantasyPoints(statName, rawStatValue, currentScoringRules) {
        if (!rawStatValue || rawStatValue === 0) {
            return rawStatValue || 0;
        }

        if (!currentScoringRules || Object.keys(currentScoringRules).length === 0) {
            return rawStatValue || 0;
        }

        const statId = Object.keys(this.getStatIdMapping()).find(id =>
            this.getStatIdMapping()[id] === statName
        );

        if (!statId || !currentScoringRules[statId]) {
            return rawStatValue || 0;
        }

        return this.calculatePoints(statId, rawStatValue, currentScoringRules[statId]);
    },

    calculateTotalFantasyPoints(player, currentScoringRules) {
        if (!player.rawStats) {
            return 0;
        }

        if (!currentScoringRules || Object.keys(currentScoringRules).length === 0) {
            return 0;
        }

        let totalPoints = 0;

        try {
            Object.entries(player.rawStats).forEach(([statId, statValue]) => {
                if (currentScoringRules[statId] && statValue !== 0) {
                    const rule = currentScoringRules[statId];

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
    },

    calculatePoints(statId, rawStatValue, rule) {
        let points = rawStatValue * parseFloat(rule.points || 0);

        if (rule.bonuses && Array.isArray(rule.bonuses)) {
            rule.bonuses.forEach(bonusRule => {
                const target = parseFloat(bonusRule.bonus.target || 0);
                const bonusPoints = parseFloat(bonusRule.bonus.points || 0);

                if (rawStatValue >= target && target > 0) {
                    const bonusesEarned = Math.floor(rawStatValue / target);
                    points += bonusesEarned * bonusPoints;
                }
            });
        }

        return points;
    },

    getStatIdMapping() {
        return {
            "0": "Games Played", "1": "Pass Att", "2": "Comp", "3": "Inc", "4": "Pass Yds",
            "5": "Pass TD", "6": "Int", "7": "Sack", "8": "Rush Att", "9": "Rush Yds",
            "10": "Rush TD", "11": "Rec", "12": "Rec Yds", "13": "Rec TD", "14": "Ret Yds",
            "15": "Ret TD", "16": "2-PT", "17": "Fum", "18": "Fum Lost", "19": "FG 0-19",
            "20": "FG 20-29", "21": "FG 30-39", "22": "FG 40-49", "23": "FG 50+",
            "24": "FGM 0-19", "25": "FGM 20-29", "26": "FGM 30-39", "27": "FGM 40-49",
            "28": "FGM 50+", "29": "PAT Made", "30": "PAT Miss", "31": "Pts Allow",
            "32": "Sack", "33": "Int", "34": "Fum Rec", "35": "TD", "36": "Safe",
            "37": "Blk Kick", "38": "Tack Solo", "39": "Tack Ast", "40": "Sack",
            "41": "Int", "42": "Fum Force", "43": "Fum Rec", "44": "TD", "45": "Safe",
            "46": "Pass Def", "47": "Blk Kick", "48": "Ret Yds", "49": "Ret TD",
            "50": "Pts Allow 0", "51": "Pts Allow 1-6", "52": "Pts Allow 7-13",
            "53": "Pts Allow 14-20", "54": "Pts Allow 21-27", "55": "Pts Allow 28-34",
            "56": "Pts Allow 35+", "57": "Fum Ret TD", "58": "Pick Six", "59": "40 Yd Comp",
            "60": "40 Yd Pass TD", "61": "40 Yd Rush", "62": "40 Yd Rush TD",
            "63": "40 Yd Rec", "64": "40 Yd Rec TD", "65": "TFL", "66": "TO Ret Yds",
            "67": "4 Dwn Stops", "68": "TFL", "69": "Def Yds Allow", "70": "Yds Allow Neg",
            "71": "Yds Allow 0-99", "72": "Yds Allow 100-199", "73": "Yds Allow 200-299",
            "74": "Yds Allow 300-399", "75": "Yds Allow 400-499", "76": "Yds Allow 500+",
            "77": "3 and Outs", "78": "Targets", "79": "Pass 1st Downs", "80": "Rec 1st Downs",
            "81": "Rush 1st Downs", "82": "XPR", "83": "XPR", "84": "FG Yds",
            "85": "FG Made", "86": "FG Miss"
        };
    }
};