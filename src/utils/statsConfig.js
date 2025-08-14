// src/utils/statsConfig.js
export const STAT_ID_MAPPING = {
    "0": "GP",
    "1": "Pass Att",
    "2": "Pass Comp",
    "3": "Pass Inc",
    "4": "Pass Yds",
    "5": "Pass TD",
    "6": "Pass Int",
    "7": "Pass Sack",
    "8": "Rush Att",
    "9": "Rush Yds",
    "10": "Rush TD",
    "11": "Rec",
    "12": "Rec Yds", 
    "13": "Rec TD",
    "14": "Ret Yds",
    "15": "Ret TD",
    "16": "2PT",
    "17": "Fum",
    "18": "Fum Lost",
    "19": "FG 0-19",
    "20": "FG 20-29",
    "21": "FG 30-39", 
    "22": "FG 40-49",
    "23": "FG 50+",
    "24": "FG Miss 0-19",
    "25": "FG Miss 20-29",
    "26": "FG Miss 30-39",
    "27": "FG Miss 40-49", 
    "28": "FG Miss 50+",
    "29": "XP",
    "30": "XP Miss",
    "31": "Pts Allow 0",
    "32": "Pts Allow 1-6",
    "33": "Pts Allow 7-13",
    "34": "Pts Allow 14-20",
    "35": "Pts Allow 21-27",
    "36": "Pts Allow 28-34",
    "37": "Pts Allow 35+",
    "38": "Fum Ret TD",
    "39": "Pick Six", 
    "40": "TO Ret Yds",
    "41": "4 Dwn Stops",
    "42": "TFL",
    "43": "Def Yds Allow",
    "44": "Yds Allow Neg",
    "45": "Yds Allow 0-99",
    "46": "Yds Allow 100-199",
    "47": "Yds Allow 200-299",
    "48": "Yds Allow 300-399", 
    "49": "Yds Allow 400-499",
    "50": "Yds Allow 500+",
    "51": "3 and Outs",
    "52": "Tack Solo",
    "53": "Tack Ast",
    "54": "Pass Def",
    "55": "Sack",
    "56": "Int",
    "57": "Fum Rec",
    "58": "Fum Force",
    "59": "TD",
    "60": "Safe",
    "61": "Blk Kick"
};

export const POSITION_STATS = {
    "ALL": Object.values(STAT_ID_MAPPING),
    "QB": ["Pass Att", "Pass Comp", "Pass Yds", "Pass TD", "Pass Int", "Rush Att", "Rush Yds", "Rush TD", "2PT", "Fum"],
    "RB": ["Rush Att", "Rush Yds", "Rush TD", "Rec", "Rec Yds", "Rec TD", "2PT", "Fum"],
    "WR": ["Rec", "Rec Yds", "Rec TD", "Rush Att", "Rush Yds", "Rush TD", "Ret Yds", "Ret TD", "2PT", "Fum"],
    "TE": ["Rec", "Rec Yds", "Rec TD", "2PT", "Fum"],
    "K": ["FG 0-19", "FG 20-29", "FG 30-39", "FG 40-49", "FG 50+", "FG Miss 0-19", "FG Miss 20-29", "FG Miss 30-39", "FG Miss 40-49", "FG Miss 50+", "XP", "XP Miss"],
    "DST": ["Pts Allow 0", "Pts Allow 1-6", "Pts Allow 7-13", "Pts Allow 14-20", "Pts Allow 21-27", "Pts Allow 28-34", "Pts Allow 35+", "Fum Ret TD", "Pick Six", "TO Ret Yds", "4 Dwn Stops", "TFL", "Def Yds Allow", "Yds Allow Neg", "Yds Allow 0-99", "Yds Allow 100-199", "Yds Allow 200-299", "Yds Allow 300-399", "Yds Allow 400-499", "Yds Allow 500+", "3 and Outs"],
    "LB": ["Ret Yds", "Ret TD", "Tack Solo", "Tack Ast", "Pass Def", "Sack", "Int", "Fum Rec", "Fum Force", "TD", "Safe", "Blk Kick", "TFL"],
    "CB": ["Ret Yds", "Ret TD", "Tack Solo", "Tack Ast", "Pass Def", "Sack", "Int", "Fum Rec", "Fum Force", "TD", "Safe", "Blk Kick"],
    "S": ["Ret Yds", "Ret TD", "Tack Solo", "Tack Ast", "Pass Def", "Sack", "Int", "Fum Rec", "Fum Force", "TD", "Safe", "Blk Kick"],
    "DE": ["Ret Yds", "Ret TD", "Tack Solo", "Tack Ast", "Pass Def", "Sack", "Int", "Fum Rec", "Fum Force", "TD", "Safe", "Blk Kick", "TFL"],
    "DT": ["Tack Solo", "Tack Ast", "Pass Def", "Sack", "Int", "Fum Rec", "Fum Force", "TD", "Safe", "Blk Kick", "Ret Yds", "Ret TD", "TFL"]
};

export class StatsConfig {
    static getPositionStats(position) {
        return POSITION_STATS[position?.toUpperCase()] || POSITION_STATS.ALL;
    }

    static getStatName(statId) {
        return STAT_ID_MAPPING[statId] || `Stat ${statId}`;
    }

    static calculateFantasyPoints(statId, rawValue, scoringRule) {
        if (!rawValue || rawValue === 0) return 0;
        if (!scoringRule) return 0;

        // Base points calculation
        let points = rawValue * parseFloat(scoringRule.points || 0);

        // Add bonus points if applicable
        if (scoringRule.bonuses && Array.isArray(scoringRule.bonuses)) {
            scoringRule.bonuses.forEach(bonusRule => {
                const target = parseFloat(bonusRule.bonus.target || 0);
                const bonusPoints = parseFloat(bonusRule.bonus.points || 0);

                if (rawValue >= target && target > 0) {
                    const bonusesEarned = Math.floor(rawValue / target);
                    points += bonusesEarned * bonusPoints;
                }
            });
        }

        return Math.round(points * 100) / 100;
    }

    static getFantasyStatValue(player, stat, scoringRules = null) {
        if (!player?.stats || !scoringRules) {
            return player?.stats?.[stat] || 0;
        }

        const statId = Object.keys(STAT_ID_MAPPING).find(id => 
            STAT_ID_MAPPING[id] === stat
        );

        if (!statId || !scoringRules[statId]) {
            return player.stats[stat] || 0;
        }

        const rawValue = player.stats[stat] || 0;
        return this.calculateFantasyPoints(statId, rawValue, scoringRules[statId]);
    }

    static categorizeStats(stats) {
        const categories = {
            'Offense': [],
            'Defense': [],
            'Kicking': [],
            'Special Teams': []
        };

        stats.forEach(stat => {
            if (stat.includes('Pass') || stat.includes('Rush') || stat.includes('Rec')) {
                categories.Offense.push(stat);
            } else if (stat.includes('Tack') || stat.includes('Sack') || stat.includes('Int')) {
                categories.Defense.push(stat);
            } else if (stat.includes('FG') || stat.includes('XP')) {
                categories.Kicking.push(stat);
            } else {
                categories['Special Teams'].push(stat);
            }
        });

        return categories;
    }
}

export default StatsConfig;