export default function polarToCartesian(radius, angleInDegrees, originX=0, originY=0, angleOffset=0) {
    const angleInRadians = (angleInDegrees + angleOffset) * Math.PI / 180;
    const x = originX + radius * Math.cos(angleInRadians);
    const y = originY + radius * Math.sin(angleInRadians);
    return {x, y};
}