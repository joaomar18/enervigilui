<script lang="ts">
    import { onMount } from "svelte";
    import MeasurementsGraph from "../../../components/Devices/Nodes/MeasurementsGraph/MeasurementsGraph.svelte";
    import type { MeasurementLogPoint } from "$lib/types/nodes/base";
    import { addToDate } from "$lib/logic/util/date";
    import { loadedDone } from "$lib/stores/view/navigation";

    // Generate mock measurement data for last 6 hours at 15m intervals
    const now = new Date();
    const start = addToDate(now, 0, 0, 0, -50); // 6 hours ago
    const stepMinutes = 60;
    const points: MeasurementLogPoint[] = [];

    // Helper to produce pseudo-random but smooth values
    function baseValue(tIdx: number): number {
        // gentle sinusoidal variation + baseline
        return 220 + Math.sin(tIdx / 4) * 5 + (tIdx % 7) * 0.8;
    }

    let cursor = new Date(start.getTime());
    let idx = 0;
    while (cursor < now) {
        const periodStart = new Date(cursor.getTime());
        const periodEnd = addToDate(periodStart, 0, 0, 0, 0, stepMinutes);
        const startMs = periodStart.getTime();
        const endMs = periodEnd.getTime();
        const v = baseValue(idx);
        const min = v - (Math.random() * 2 + 0.5);
        const max = v + (Math.random() * 2 + 0.5);
        const avg = (min + max) / 2;
        points.push({
            startTime: periodStart.toISOString(),
            endTime: periodEnd.toISOString(),
            startTimeMs: startMs,
            endTimeMs: endMs,
            average: avg,
            minimum: min,
            maximum: max,
        });
        cursor = periodEnd;
        idx++;
    }

    // Intentionally insert a gap (no data) in one interval to simulate missing data
    if (points.length > 5) {
        // Remove the 6th point's statistics to represent empty bucket
        const gap = points[5];
        (gap as any).average = null;
        (gap as any).minimum = null;
        (gap as any).maximum = null;
    }

    onMount(() => {
        loadedDone.set(true);
    });

    const mockMeasurements = points;
</script>

<MeasurementsGraph measurementPoints={mockMeasurements} />
