import { MathUtils } from 'three'

export function calculateFocusDistance(
  radius: number,
  verticalFovDegrees: number,
  aspect: number,
  padding: number,
  minimum: number,
): number {
  const verticalHalfFov = MathUtils.degToRad(verticalFovDegrees) / 2
  const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * Math.max(aspect, Number.EPSILON))
  const limitingHalfFov = Math.min(verticalHalfFov, horizontalHalfFov)
  return Math.max(radius / Math.sin(limitingHalfFov), minimum) * padding
}
