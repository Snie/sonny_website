"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "@wrksz/themes/client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { ContentSection } from "@/components/ui/content-section";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function LanguagesSection() {
  const t = useTranslations("languages");
  const { resolvedTheme } = useTheme();

  const entries = [
    {
      language: t("entries.0.language"),
      level: t("entries.0.level"),
      proficiency: t("entries.0.proficiency"),
      story: t("entries.0.story"),
    },
    {
      language: t("entries.1.language"),
      level: t("entries.1.level"),
      proficiency: t("entries.1.proficiency"),
      story: t("entries.1.story"),
    },
    {
      language: t("entries.2.language"),
      level: t("entries.2.level"),
      proficiency: t("entries.2.proficiency"),
      story: t("entries.2.story"),
    },
    {
      language: t("entries.3.language"),
      level: t("entries.3.level"),
      proficiency: t("entries.3.proficiency"),
      story: t("entries.3.story"),
    },
    {
      language: t("entries.4.language"),
      level: t("entries.4.level"),
      proficiency: t("entries.4.proficiency"),
      story: t("entries.4.story"),
    },
  ];

  const isDark = resolvedTheme === "dark";
  const accentColor = isDark ? "#00ff00" : "#00ffff";
  const textColor = isDark ? "#e5e5e5" : "#262626";
  const gridColor = isDark ? "#333333" : "#e5e5e5";

  const series = useMemo(
    () => [
      {
        name: "Proficiency",
        data: entries.map((e) => Number(e.proficiency)),
      },
    ],
    [entries]
  );

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "radar",
        background: "transparent",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 1200,
          animateGradually: {
            enabled: true,
            delay: 200,
          },
        },
        toolbar: {
          show: false,
        },
        fontFamily: "inherit",
        sparkline: {
          enabled: false,
        },
      },
      colors: [accentColor],
      fill: {
        type: "gradient",
        gradient: {
          shade: isDark ? "dark" : "light",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: [accentColor],
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      stroke: {
        show: true,
        width: 3,
        colors: [accentColor],
        dashArray: 0,
      },
      markers: {
        size: 6,
        colors: [accentColor],
        strokeColors: isDark ? "#000000" : "#ffffff",
        strokeWidth: 2,
        hover: {
          size: 8,
          sizeOffset: 2,
        },
      },
      xaxis: {
        categories: entries.map((e) => `${e.language} - ${e.level}`),
        labels: {
          show: true,
          style: {
            colors: Array(5).fill(textColor),
            fontSize: "13px",
            fontWeight: 700,
          },
          offsetY: 5,
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          show: true,
          style: {
            colors: textColor,
            fontSize: "11px",
            fontWeight: 600,
          },
          formatter: (val: number) => {
            if (val <= 32) return "";
            if (val > 32 && val <= 55) return "B1";
            if (val > 55 && val <= 70) return "B2";
            if (val > 70 && val <= 85) return "C1";
            return "C2";
          },
        },
      },
      plotOptions: {
        radar: {
          size: undefined, // Let it auto-size based on container
          offsetX: 0,
          offsetY: 0,
          polygons: {
            strokeColors: gridColor,
            strokeWidth: "1",
            connectorColors: gridColor,
            fill: {
              colors: undefined,
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 640,
          options: {
            xaxis: {
              labels: {
                style: {
                  fontSize: "11px",
                },
              },
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: "10px",
                },
                formatter: (val: number) => {
                  if (val <= 32) return "";
                  if (val > 32 && val <= 55) return "B1";
                  if (val > 55 && val <= 70) return "B2";
                  if (val > 70 && val <= 85) return "C1";
                  return "C2";
                },
              },
            },
          },
        },
      ],
      tooltip: {
        enabled: true,
        theme: isDark ? "dark" : "light",
        style: {
          fontSize: "13px",
        },
        y: {
          formatter: (val, opts) => {
            if (opts && typeof opts.dataPointIndex === "number") {
              const entry = entries[opts.dataPointIndex];
              return `${val}% — ${entry.story}`;
            }
            return `${val}%`;
          },
        },
      },
      legend: {
        show: false,
      },
    }),
    [entries, accentColor, textColor, gridColor, isDark]
  );

  return (
    <ContentSection maxWidth="4xl" heading={t("heading")}>
      <div className="flex flex-col items-center gap-8">
        <div className="w-full max-w-3xl">
          <Chart
            options={options}
            series={series}
            type="radar"
            height={500}
            width="100%"
          />
        </div>

        {/* Language details grid */}
      </div>
    </ContentSection>
  );
}
