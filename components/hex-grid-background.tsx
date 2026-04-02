"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@wrksz/themes/client";

interface HexCell {
  q: number;
  r: number;
  s: number;
  x: number;
  y: number;
  fillAlpha: number;
  targetAlpha: number;
  nextChangeTime: number;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

interface TravelingLight {
  currentQ: number;
  currentR: number;
  currentEdge: number;
  progress: number;
  speed: number;
  intensity: number;
  trail: TrailPoint[];
}

export function HexGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const size = 100;
    const speed = 0.008; // Base speed for lights (slow)

    // Theme-based colors
    const isDark = resolvedTheme === "dark";
    const primaryColor = isDark
      ? { r: 0, g: 255, b: 0 }     // Terminal green
      : { r: 0, g: 255, b: 255 };  // Cyan

    // Visual configuration
    const config = {
      hexFillAlphaMultiplier: 0.08,  // Controls hex fill intensity
      lightGlowRadius: 8,
      lightCoreRadius: 2.5,
      trailGlowRadius: 4,
      trailLength: 25,
      trailFadeRate: 0.92,
    };

    const orientation = {
      f0: 3.0 / 2.0,
      f1: 0.0,
      f2: Math.sqrt(3.0) / 2.0,
      f3: Math.sqrt(3.0),
    };

    const hexToPixel = (q: number, r: number) => {
      const x = (orientation.f0 * q + orientation.f1 * r) * size;
      const y = (orientation.f2 * q + orientation.f3 * r) * size;
      return { x, y };
    };

    const cellsMap = new Map<string, HexCell>();

    const hexWidth = size * 3;
    const hexHeight = size * Math.sqrt(3);
    const cols = Math.ceil(canvas.width / hexWidth) + 10; // more columns
    const rows = Math.ceil(canvas.height / hexHeight) + 11; //more rows

    const startQ = -Math.floor(cols / 2) - 2;
    const startR = -Math.floor(rows / 2) - 2;

    for (let r = startR; r < startR + rows; r++) {
      for (let q = startQ; q < startQ + cols; q++) {
        const s = -q - r;
        const { x, y } = hexToPixel(q, r);

        const screenX = x + canvas.width / 2;
        const screenY = y + canvas.height / 2;

        const key = `${q},${r}`;
        cellsMap.set(key, {
          q,
          r,
          s,
          x: screenX,
          y: screenY,
          fillAlpha: 0,
          targetAlpha: 0,
          nextChangeTime: Math.random() * 3000,
        });
      }
    }

    const cells = Array.from(cellsMap.values());

    // Cube coordinate neighbor offsets
    const directions = [
      { q: 1, r: 0 },   // 0: E
      { q: 1, r: -1 },  // 1: NE
      { q: 0, r: -1 },  // 2: NW
      { q: -1, r: 0 },  // 3: W
      { q: -1, r: 1 },  // 4: SW
      { q: 0, r: 1 },   // 5: SE
    ];

    // Edge-to-neighbor mapping for flat-top hexagons
    // When a dot finishes edge E, it arrives at corner (E+1)%6 of current hex,
    // which is corner (E+3)%6 of the neighbor — so enterEdge = (E+3)%6
    const edgeToNeighbor = [
      { dir: 0, enterEdge: 3 },  // Edge 0 → neighbor dir 0, enter at corner 3
      { dir: 5, enterEdge: 4 },  // Edge 1 → neighbor dir 5, enter at corner 4
      { dir: 4, enterEdge: 5 },  // Edge 2 → neighbor dir 4, enter at corner 5
      { dir: 3, enterEdge: 0 },  // Edge 3 → neighbor dir 3, enter at corner 0
      { dir: 2, enterEdge: 1 },  // Edge 4 → neighbor dir 2, enter at corner 1
      { dir: 1, enterEdge: 2 },  // Edge 5 → neighbor dir 1, enter at corner 2
    ];

    const lights: TravelingLight[] = [];
    const maxLights = 7;

    const createLight = () => {
      const randomCell = cells[Math.floor(Math.random() * cells.length)];
      return {
        currentQ: randomCell.q,
        currentR: randomCell.r,
        currentEdge: Math.floor(Math.random() * 6),
        progress: 0,
        speed: speed + Math.random() * speed,
        intensity: 0.8 + Math.random() * 0.2,
        trail: [],
      };
    };

    for (let i = 0; i < maxLights; i++) {
      lights.push(createLight());
    }

    const getHexCorners = (x: number, y: number) => {
      const corners: { x: number; y: number }[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        corners.push({
          x: x + size * Math.cos(angle),
          y: y + size * Math.sin(angle),
        });
      }
      return corners;
    };

    const drawHexagon = (
      x: number,
      y: number,
      fill: boolean = false,
      fillAlpha: number = 0
    ) => {
      const corners = getHexCorners(x, y);

      ctx.beginPath();
      corners.forEach((corner, i) => {
        if (i === 0) {
          ctx.moveTo(corner.x, corner.y);
        } else {
          ctx.lineTo(corner.x, corner.y);
        }
      });
      ctx.closePath();

      if (fill && fillAlpha > 0) {
        ctx.fillStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${fillAlpha * config.hexFillAlphaMultiplier})`;
        ctx.fill();
      }

      const strokeColor = isDark
        ? "rgba(100, 100, 100, 0.2)"
        : "rgba(200, 200, 200, 0.2)";
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawLightDot = (x: number, y: number, intensity: number) => {
      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, config.lightGlowRadius);
      gradient.addColorStop(0, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${intensity * 0.9})`);
      gradient.addColorStop(0.4, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${intensity * 0.5})`);
      gradient.addColorStop(1, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, config.lightGlowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Bright center
      const lightR = Math.min(255, primaryColor.r + 150);
      const lightG = Math.min(255, primaryColor.g);
      const lightB = Math.min(255, primaryColor.b + 150);
      ctx.fillStyle = `rgba(${lightR}, ${lightG}, ${lightB}, ${intensity})`;
      ctx.beginPath();
      ctx.arc(x, y, config.lightCoreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Tiny white core
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.9})`;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawTrailDot = (x: number, y: number, alpha: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, config.trailGlowRadius);
      gradient.addColorStop(0, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${alpha * 0.6})`);
      gradient.addColorStop(0.5, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, config.trailGlowRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        lights.forEach((light) => {
          const key = `${light.currentQ},${light.currentR}`;
          const currentCell = cellsMap.get(key);

          if (currentCell) {
            const corners = getHexCorners(currentCell.x, currentCell.y);
            const startCorner = corners[light.currentEdge];
            const endCorner = corners[(light.currentEdge + 1) % 6];

            const currentX = startCorner.x + (endCorner.x - startCorner.x) * light.progress;
            const currentY = startCorner.y + (endCorner.y - startCorner.y) * light.progress;

            // Add current position to trail
            light.trail.push({
              x: currentX,
              y: currentY,
              alpha: 1.0,
            });

            // Limit trail length
            if (light.trail.length > config.trailLength) {
              light.trail.shift();
            }

            // Fade trail
            light.trail.forEach((point) => {
              point.alpha *= config.trailFadeRate;
            });

            // Move light along edge
            light.progress += light.speed;

            // If reached end of edge, move to next
            if (light.progress >= 1) {
              light.progress = 0;

              const random = Math.random();
              let nextQ = light.currentQ;
              let nextR = light.currentR;
              let nextEdge = light.currentEdge;
              let willChangeCell = false;

              if (random < 0.30) {
                const mapping = edgeToNeighbor[light.currentEdge];
                const dir = directions[mapping.dir];
                nextQ = light.currentQ + dir.q;
                nextR = light.currentR + dir.r;
                nextEdge = mapping.enterEdge;
                willChangeCell = true;
              } else {
                // 15% turn forward (only +1 to keep corners aligned)
                nextEdge = (light.currentEdge + 1) % 6;
              }

              const newKey = `${nextQ},${nextR}`;
              if (willChangeCell && cellsMap.has(newKey)) {
                light.currentQ = nextQ;
                light.currentR = nextR;
                light.currentEdge = nextEdge;
              } else if (willChangeCell) {
                // Hit grid edge - turn forward only
                light.currentEdge = (light.currentEdge + 1) % 6;
              } else {
                // Turning on same cell
                light.currentEdge = nextEdge;
              }
            }
          }
        });

        // Update fill animations
        const currentTime = Date.now();
        cells.forEach((cell) => {
          if (currentTime > cell.nextChangeTime) {
            cell.targetAlpha = Math.random() > 0.95 ? 1 : 0;
            cell.nextChangeTime = currentTime + 2000 + Math.random() * 3000;
          }

          const speed = 0.05;
          cell.fillAlpha += (cell.targetAlpha - cell.fillAlpha) * speed;
        });
      }

      // Draw all hexagons
      cells.forEach((cell) => {
        const hasFill = cell.fillAlpha > 0.01;
        drawHexagon(cell.x, cell.y, hasFill, cell.fillAlpha);
      });

      // Draw trails and light dots
      if (!prefersReducedMotion) {
        lights.forEach((light) => {
          // Draw trail
          light.trail.forEach((point) => {
            if (point.alpha > 0.05) {
              drawTrailDot(point.x, point.y, point.alpha);
            }
          });

          // Draw main light dot on top
          const key = `${light.currentQ},${light.currentR}`;
          const currentCell = cellsMap.get(key);

          if (currentCell) {
            const corners = getHexCorners(currentCell.x, currentCell.y);
            const startCorner = corners[light.currentEdge];
            const endCorner = corners[(light.currentEdge + 1) % 6];

            const dotX = startCorner.x + (endCorner.x - startCorner.x) * light.progress;
            const dotY = startCorner.y + (endCorner.y - startCorner.y) * light.progress;

            drawLightDot(dotX, dotY, light.intensity);
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
