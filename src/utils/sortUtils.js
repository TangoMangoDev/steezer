
export const SortUtils = {
    sortResearchTable(players, column, currentSort, showFantasyStats, calculateTotalFantasyPoints) {
        console.log(`🔄 Sorting by: ${column}`);

        let direction = 'desc';
        if (currentSort.column === column) {
            direction = currentSort.direction === 'desc' ? 'asc' : 'desc';
        }

        const sortedPlayers = [...players].sort((a, b) => {
            let aValue, bValue;

            switch(column) {
                case 'overallRank':
                    aValue = a.overallRank || 999999;
                    bValue = b.overallRank || 999999;
                    break;
                case 'positionRank':
                    aValue = a.positionRank || 999999;
                    bValue = b.positionRank || 999999;
                    break;
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'fantasyPoints':
                    if (showFantasyStats) {
                        aValue = calculateTotalFantasyPoints(a);
                        bValue = calculateTotalFantasyPoints(b);
                    } else {
                        return 0;
                    }
                    break;
                default:
                    aValue = parseFloat(a.stats[column]) || 0;
                    bValue = parseFloat(b.stats[column]) || 0;
            }

            if (column === 'name') {
                return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
        });

        const newSort = { column, direction };
        console.log(`✅ Sorted by ${column} (${direction})`);

        return { sortedPlayers, newSort };
    }
};
