import {clamp} from '@math.gl/core'

/**
 * Convert latitude and longitudes to heading.
 * @see https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/
 * @param lati latitude of starting point in degrees.
 * @param loni longitude of starting point in degrees.
 * @param latf latitude of ending point in degrees.
 * @param lonf longitude of ending point in degrees.
 * @return The heading of the ending point relative to North (CW is +) in degrees.
 */
export function convertCoordsToHeading(lati: number, loni: number, latf: number, lonf: number) {
  const DEGREES_TO_RADIANS = Math.PI / 180
  lati *= DEGREES_TO_RADIANS
  loni *= DEGREES_TO_RADIANS
  latf *= DEGREES_TO_RADIANS
  lonf *= DEGREES_TO_RADIANS

  const deltaL = lonf - loni
  const x = Math.cos(latf) * Math.sin(deltaL)
  const y = Math.cos(lati) * Math.sin(latf) - Math.sin(lati) * Math.cos(latf) * Math.cos(deltaL)
  const bearing = Math.atan2(x, y)
  return bearing / DEGREES_TO_RADIANS
}

/**
 * Convert latitude and longitudes to distance.
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 * @param lati latitude of starting point in degrees.
 * @param loni longitude of starting point in degrees.
 * @param latf latitude of ending point in degrees.
 * @param lonf longitude of ending point in degrees.
 * @param radius radius of the planet in km (default is Earth: 6,371km).
 * @return The distance in km.
 */
export function convertCoordsToDistance(
  lati: number,
  loni: number,
  latf: number,
  lonf: number,
  radius = 6371
) {
  const DEGREES_TO_RADIANS = Math.PI / 180
  lati *= DEGREES_TO_RADIANS
  loni *= DEGREES_TO_RADIANS
  latf *= DEGREES_TO_RADIANS
  lonf *= DEGREES_TO_RADIANS

  let h =
    (1 - Math.cos(latf - lati) + Math.cos(lati) * Math.cos(latf) * (1 - Math.cos(lonf - loni))) / 2
  h = clamp(h, 0, 1) // ensure 0 <= h <= 1
  const d = 2 * radius * Math.asin(Math.sqrt(h))
  return d
}
