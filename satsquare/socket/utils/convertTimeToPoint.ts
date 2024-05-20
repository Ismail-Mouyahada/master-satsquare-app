/**
 * Converts the elapsed time since the start of the round to points.
 * 
 * @param startTime - The start time of the round in milliseconds.
 * @param secondes - The total time allowed for the round in seconds.
 * @returns The calculated points based on the elapsed time.
 */
const convertTimeToPoint = (startTime: number, secondes: number): number => {
    let points = 1000;

    // Get the current time in milliseconds
    const actualTime = Date.now();

    // Calculate the elapsed time in seconds
    const tempsPasseEnSecondes = (actualTime - startTime) / 1000;

    // Calculate points based on the elapsed time
    points -= (1000 / secondes) * tempsPasseEnSecondes;

    // Ensure points do not go below 0
    points = Math.max(0, points);

    return points;
};

export default convertTimeToPoint;
