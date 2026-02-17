import {
  calculateDistance,
  calculateSlope,
  clampSlope,
  findWaypointAtDistance,
  getCoordinatesAtDistance,
  interpolateSlope,
  parseGPX,
} from "../gpxParser";
import { Waypoint } from "@/types/route";

describe("gpxParser", () => {
  describe("calculateDistance", () => {
    it("calculates distance between two close points", () => {
      // ~111km (1 degree of latitude)
      const distance = calculateDistance(0, 0, 1, 0);
      expect(distance).toBeCloseTo(111195, -3); // Within 1km
    });

    it("calculates distance between same points", () => {
      const distance = calculateDistance(40.7128, -74.006, 40.7128, -74.006);
      expect(distance).toBe(0);
    });

    it("calculates distance between NYC and LA", () => {
      // NYC: 40.7128° N, 74.0060° W
      // LA: 34.0522° N, 118.2437° W
      const distance = calculateDistance(40.7128, -74.006, 34.0522, -118.2437);
      expect(distance).toBeGreaterThan(3900000); // > 3900km
      expect(distance).toBeLessThan(4100000); // < 4100km
    });

    it("handles negative coordinates", () => {
      const distance = calculateDistance(-10, -20, -11, -21);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe("calculateSlope", () => {
    it("calculates positive slope", () => {
      const slope = calculateSlope(10, 100);
      expect(slope).toBe(10); // 10%
    });

    it("calculates negative slope", () => {
      const slope = calculateSlope(-5, 100);
      expect(slope).toBe(-5); // -5%
    });

    it("returns 0 for zero distance", () => {
      const slope = calculateSlope(10, 0);
      expect(slope).toBe(0);
    });

    it("handles zero elevation change", () => {
      const slope = calculateSlope(0, 100);
      expect(slope).toBe(0);
    });

    it("calculates steep slope", () => {
      const slope = calculateSlope(20, 100);
      expect(slope).toBe(20); // 20%
    });
  });

  describe("clampSlope", () => {
    it("clamps slope to default max", () => {
      const clamped = clampSlope(25);
      expect(clamped).toBe(20);
    });

    it("clamps slope to default min", () => {
      const clamped = clampSlope(-15);
      expect(clamped).toBe(-10);
    });

    it("does not clamp slopes within range", () => {
      const clamped = clampSlope(5);
      expect(clamped).toBe(5);
    });

    it("respects custom min/max", () => {
      const clamped = clampSlope(25, -5, 15);
      expect(clamped).toBe(15);
    });

    it("clamps to custom min", () => {
      const clamped = clampSlope(-10, -5, 15);
      expect(clamped).toBe(-5);
    });
  });

  describe("interpolateSlope", () => {
    it("calculates slope between waypoints", () => {
      const current: Waypoint = {
        lat: 0,
        lon: 0,
        elevation: 100,
        distanceFromStart: 0,
      };
      const next: Waypoint = {
        lat: 0,
        lon: 0,
        elevation: 110,
        distanceFromStart: 100,
      };

      const slope = interpolateSlope(current, next, 0.5);
      expect(slope).toBe(10); // 10% slope
    });

    it("handles negative slope", () => {
      const current: Waypoint = {
        lat: 0,
        lon: 0,
        elevation: 200,
        distanceFromStart: 0,
      };
      const next: Waypoint = {
        lat: 0,
        lon: 0,
        elevation: 190,
        distanceFromStart: 100,
      };

      const slope = interpolateSlope(current, next, 0.5);
      expect(slope).toBe(-10); // -10% slope
    });

    it("handles zero distance between waypoints", () => {
      const current: Waypoint = {
        lat: 0,
        lon: 0,
        elevation: 100,
        distanceFromStart: 0,
      };
      const next: Waypoint = {
        lat: 0,
        lon: 0,
        elevation: 110,
        distanceFromStart: 0,
      };

      const slope = interpolateSlope(current, next, 0.5);
      expect(slope).toBe(0);
    });
  });

  describe("findWaypointAtDistance", () => {
    const waypoints: Waypoint[] = [
      { lat: 0, lon: 0, elevation: 100, distanceFromStart: 0 },
      { lat: 0, lon: 0, elevation: 110, distanceFromStart: 100 },
      { lat: 0, lon: 0, elevation: 120, distanceFromStart: 200 },
      { lat: 0, lon: 0, elevation: 130, distanceFromStart: 300 },
    ];

    it("finds waypoint at exact distance", () => {
      const index = findWaypointAtDistance(waypoints, 100);
      expect(index).toBe(1);
    });

    it("finds waypoint before distance", () => {
      const index = findWaypointAtDistance(waypoints, 150);
      expect(index).toBe(1);
    });

    it("returns 0 for negative distance", () => {
      const index = findWaypointAtDistance(waypoints, -10);
      expect(index).toBe(0);
    });

    it("returns last index for distance beyond route", () => {
      const index = findWaypointAtDistance(waypoints, 1000);
      expect(index).toBe(3);
    });

    it("returns 0 for empty waypoints array", () => {
      const index = findWaypointAtDistance([], 100);
      expect(index).toBe(0);
    });

    it("handles single waypoint", () => {
      const single = [waypoints[0]];
      const index = findWaypointAtDistance(single, 100);
      expect(index).toBe(0);
    });
  });

  describe("getCoordinatesAtDistance", () => {
    const waypoints: Waypoint[] = [
      { lat: 0, lon: 0, elevation: 100, distanceFromStart: 0 },
      { lat: 1, lon: 1, elevation: 110, distanceFromStart: 100 },
      { lat: 2, lon: 2, elevation: 120, distanceFromStart: 200 },
    ];

    it("returns exact coordinates at waypoint", () => {
      const coords = getCoordinatesAtDistance(waypoints, 100);
      expect(coords.lat).toBe(1);
      expect(coords.lon).toBe(1);
    });

    it("interpolates coordinates between waypoints", () => {
      const coords = getCoordinatesAtDistance(waypoints, 50);
      expect(coords.lat).toBe(0.5);
      expect(coords.lon).toBe(0.5);
    });

    it("returns last coordinates for distance beyond route", () => {
      const coords = getCoordinatesAtDistance(waypoints, 1000);
      expect(coords.lat).toBe(2);
      expect(coords.lon).toBe(2);
    });

    it("returns 0,0 for empty waypoints", () => {
      const coords = getCoordinatesAtDistance([], 100);
      expect(coords.lat).toBe(0);
      expect(coords.lon).toBe(0);
    });

    it("returns first coordinates for negative distance", () => {
      const coords = getCoordinatesAtDistance(waypoints, -10);
      // Due to interpolation with negative distance, might return slightly before first point
      expect(coords.lat).toBeCloseTo(0, 0);
      expect(coords.lon).toBeCloseTo(0, 0);
    });
  });

  describe("parseGPX", () => {
    const validGPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Test">
  <metadata>
    <name>Test Route</name>
  </metadata>
  <trk>
    <name>Test Track</name>
    <trkseg>
      <trkpt lat="40.7128" lon="-74.0060">
        <ele>10</ele>
      </trkpt>
      <trkpt lat="40.7228" lon="-74.0160">
        <ele>20</ele>
      </trkpt>
      <trkpt lat="40.7328" lon="-74.0260">
        <ele>30</ele>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

    it("parses valid GPX content", async () => {
      const route = await parseGPX(validGPX);

      expect(route.name).toBe("Test Route");
      expect(route.waypoints.length).toBeGreaterThan(0);
      expect(route.totalDistance).toBeGreaterThan(0);
      expect(route.elevationGain).toBeGreaterThan(0);
      expect(route.source).toBe("file");
    });

    it("extracts track name when metadata is missing", async () => {
      const gpxWithoutMetadata = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <name>Track Name</name>
    <trkseg>
      <trkpt lat="40.7128" lon="-74.0060">
        <ele>10</ele>
      </trkpt>
      <trkpt lat="40.7228" lon="-74.0160">
        <ele>20</ele>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

      const route = await parseGPX(gpxWithoutMetadata);
      expect(route.name).toBe("Track Name");
    });

    it("uses default name for unnamed routes", async () => {
      const gpxWithoutName = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <trkseg>
      <trkpt lat="40.7128" lon="-74.0060">
        <ele>10</ele>
      </trkpt>
      <trkpt lat="40.7228" lon="-74.0160">
        <ele>20</ele>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

      const route = await parseGPX(gpxWithoutName);
      expect(route.name).toBe("Unnamed Route");
    });

    it("calculates elevation gain and loss", async () => {
      const gpxWithVariedElevation = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <trkseg>
      <trkpt lat="40.7128" lon="-74.0060">
        <ele>100</ele>
      </trkpt>
      <trkpt lat="40.7228" lon="-74.0160">
        <ele>150</ele>
      </trkpt>
      <trkpt lat="40.7328" lon="-74.0260">
        <ele>120</ele>
      </trkpt>
      <trkpt lat="40.7428" lon="-74.0360">
        <ele>180</ele>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;

      const route = await parseGPX(gpxWithVariedElevation);
      expect(route.elevationGain).toBeGreaterThan(0);
      expect(route.elevationLoss).toBeGreaterThan(0);
      expect(route.minElevation).toBe(100);
      expect(route.maxElevation).toBe(180);
    });

    it("handles missing elevation data", async () => {
      const gpxWithoutElevation = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <trkseg>
      <trkpt lat="40.7128" lon="-74.0060" />
      <trkpt lat="40.7228" lon="-74.0160" />
    </trkseg>
  </trk>
</gpx>`;

      const route = await parseGPX(gpxWithoutElevation);
      expect(route.waypoints[0].elevation).toBe(0);
    });

    it("handles multiple tracks", async () => {
      const gpxWithMultipleTracks = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <trkseg>
      <trkpt lat="40.7128" lon="-74.0060"><ele>10</ele></trkpt>
    </trkseg>
  </trk>
  <trk>
    <trkseg>
      <trkpt lat="40.7228" lon="-74.0160"><ele>20</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;

      const route = await parseGPX(gpxWithMultipleTracks);
      expect(route.waypoints.length).toBeGreaterThanOrEqual(2);
    });

    it("handles multiple track segments", async () => {
      const gpxWithMultipleSegments = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <trkseg>
      <trkpt lat="40.7128" lon="-74.0060"><ele>10</ele></trkpt>
    </trkseg>
    <trkseg>
      <trkpt lat="40.7228" lon="-74.0160"><ele>20</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;

      const route = await parseGPX(gpxWithMultipleSegments);
      expect(route.waypoints.length).toBeGreaterThanOrEqual(2);
    });

    it("rejects invalid GPX (missing root element)", async () => {
      const invalidGPX = `<?xml version="1.0"?><invalid></invalid>`;
      await expect(parseGPX(invalidGPX)).rejects.toThrow("Invalid GPX file");
    });

    it("rejects GPX without tracks", async () => {
      const gpxWithoutTracks = `<?xml version="1.0"?>
<gpx version="1.1"></gpx>`;
      await expect(parseGPX(gpxWithoutTracks)).rejects.toThrow(
        "No tracks found",
      );
    });

    it("rejects GPX without track points", async () => {
      const gpxWithoutPoints = `<?xml version="1.0"?>
<gpx version="1.1">
  <trk>
    <trkseg></trkseg>
  </trk>
</gpx>`;
      await expect(parseGPX(gpxWithoutPoints)).rejects.toThrow(
        "No track points found",
      );
    });

    it("skips invalid coordinates", async () => {
      const gpxWithInvalidCoords = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <trkseg>
      <trkpt lat="invalid" lon="invalid"><ele>10</ele></trkpt>
      <trkpt lat="40.7128" lon="-74.0060"><ele>10</ele></trkpt>
      <trkpt lat="40.7228" lon="-74.0160"><ele>20</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;

      const route = await parseGPX(gpxWithInvalidCoords);
      expect(route.waypoints.length).toBeGreaterThan(0);
    });

    it("sets source and sourceIdentifier correctly", async () => {
      const route = await parseGPX(
        validGPX,
        "url",
        "https://example.com/route.gpx",
      );
      expect(route.source).toBe("url");
      expect(route.sourceIdentifier).toBe("https://example.com/route.gpx");
    });

    it("generates unique route IDs", async () => {
      const route1 = await parseGPX(validGPX);
      const route2 = await parseGPX(validGPX);
      expect(route1.id).not.toBe(route2.id);
    });

    it("samples large routes to reduce waypoints", async () => {
      // Create a route with many points
      const manyPoints = Array.from({ length: 1000 }, (_, i) => {
        const lat = 40.7128 + i * 0.0001;
        const lon = -74.006 + i * 0.0001;
        return `<trkpt lat="${lat}" lon="${lon}"><ele>${100 + i * 0.1}</ele></trkpt>`;
      }).join("\n");

      const largeGPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1">
  <trk>
    <trkseg>
      ${manyPoints}
    </trkseg>
  </trk>
</gpx>`;

      const route = await parseGPX(largeGPX);
      // Should be sampled down from 1000 points
      expect(route.waypoints.length).toBeLessThan(1000);
      expect(route.waypoints.length).toBeGreaterThan(0);
    });
  });
});
