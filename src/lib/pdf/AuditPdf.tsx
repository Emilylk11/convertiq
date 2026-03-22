import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { AuditResults } from "@/lib/types";
import { getCategoryLabel, scoreColorHex } from "@/lib/audit-categories";

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    color: "#18181b",
    fontFamily: "Helvetica",
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontSize: 9,
  },
  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "2px solid #7c3aed",
  },
  logo: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#7c3aed",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerUrl: {
    fontSize: 8,
    color: "#71717a",
    marginBottom: 2,
  },
  // Score section
  scoreSection: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
  },
  scoreLeft: {
    alignItems: "center",
    width: 70,
  },
  scoreBig: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
  },
  scoreLabel: {
    fontSize: 7,
    color: "#71717a",
    marginTop: 1,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#f4f4f5",
    borderRadius: 4,
    padding: 10,
  },
  summaryText: {
    fontSize: 9,
    color: "#3f3f46",
    lineHeight: 1.5,
  },
  // Category scores
  categoryRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16,
  },
  categoryBox: {
    flex: 1,
    backgroundColor: "#f4f4f5",
    borderRadius: 4,
    padding: 6,
    alignItems: "center",
  },
  categoryScore: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  categoryName: {
    fontSize: 7,
    color: "#71717a",
    marginTop: 2,
    textTransform: "uppercase",
  },
  // Headlines
  headlineBox: {
    backgroundColor: "#f5f3ff",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    borderLeft: "3px solid #7c3aed",
  },
  headlineTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#7c3aed",
    marginBottom: 6,
  },
  headlineLabel: {
    fontSize: 7,
    color: "#71717a",
    marginBottom: 1,
  },
  headlineText: {
    fontSize: 9,
    color: "#18181b",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 4,
  },
  // Findings section
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#18181b",
  },
  // Table header
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#18181b",
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 6,
    marginBottom: 3,
  },
  thText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  // Table row
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottom: "0.5px solid #e4e4e7",
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },
  // Column widths
  colSeverity: { width: 50 },
  colCategory: { width: 40 },
  colTitle: { flex: 1, paddingRight: 6 },
  colImpact: { width: 36, alignItems: "center" as const },
  // Cell text
  cellText: {
    fontSize: 8,
    color: "#3f3f46",
  },
  cellTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#18181b",
    marginBottom: 1,
  },
  cellRec: {
    fontSize: 7,
    color: "#71717a",
    lineHeight: 1.3,
  },
  // Severity badges
  badgeCritical: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: "#dc2626",
    backgroundColor: "#fef2f2",
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeWarning: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: "#d97706",
    backgroundColor: "#fffbeb",
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeInfo: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
    backgroundColor: "#eff6ff",
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  impactBar: {
    width: 28,
    height: 4,
    backgroundColor: "#e4e4e7",
    borderRadius: 2,
  },
  impactFill: {
    height: 4,
    borderRadius: 2,
  },
  impactText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#3f3f46",
    marginTop: 1,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    borderTop: "1px solid #e4e4e7",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#a1a1aa",
  },
});

// scoreColor and categoryLabels imported from @/lib/audit-categories

function impactColor(impact: number) {
  if (impact >= 7) return "#dc2626";
  if (impact >= 4) return "#d97706";
  return "#2563eb";
}

function truncate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "\u2026";
}

const FREE_FINDINGS_LIMIT = 3;

export default function AuditPdf({
  results,
  url,
  createdAt,
  isFree = true,
}: {
  results: AuditResults;
  url: string;
  createdAt: string;
  isFree?: boolean;
}) {
  const visibleFindings = isFree
    ? results.findings.slice(0, FREE_FINDINGS_LIMIT)
    : results.findings;
  const hiddenCount = isFree
    ? Math.max(0, results.findings.length - FREE_FINDINGS_LIMIT)
    : 0;
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title={`ConvertIQ Audit — ${url}`}
      author="ConvertIQ"
      subject="Conversion Rate Optimization Audit"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.logo}>ConvertIQ</Text>
          <View style={styles.headerRight}>
            <Text style={styles.headerUrl}>{url}</Text>
            <Text style={styles.headerUrl}>{date}</Text>
          </View>
        </View>

        {/* Score + Summary */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreLeft}>
            <Text
              style={{
                ...styles.scoreBig,
                color: scoreColorHex(results.overallScore),
              }}
            >
              {results.overallScore}
            </Text>
            <Text style={styles.scoreLabel}>out of 100</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>{results.summary}</Text>
          </View>
        </View>

        {/* Category scores */}
        <View style={styles.categoryRow}>
          {Object.keys(results.categoryScores).map((cat) => (
            <View key={cat} style={styles.categoryBox}>
              <Text
                style={{
                  ...styles.categoryScore,
                  color: scoreColorHex(results.categoryScores[cat]),
                }}
              >
                {results.categoryScores[cat]}
              </Text>
              <Text style={styles.categoryName}>
                {getCategoryLabel(cat)}
              </Text>
            </View>
          ))}
        </View>

        {/* Suggested headlines */}
        {(results.rewrittenHeadline || results.rewrittenSubheadline) && (
          <View style={styles.headlineBox}>
            <Text style={styles.headlineTitle}>Suggested Rewrites</Text>
            {results.rewrittenHeadline && (
              <View>
                <Text style={styles.headlineLabel}>Headline</Text>
                <Text style={styles.headlineText}>
                  &quot;{results.rewrittenHeadline}&quot;
                </Text>
              </View>
            )}
            {results.rewrittenSubheadline && (
              <View>
                <Text style={styles.headlineLabel}>Subheadline</Text>
                <Text style={styles.headlineText}>
                  &quot;{results.rewrittenSubheadline}&quot;
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Findings table */}
        <Text style={styles.sectionTitle}>
          {isFree
            ? `Top ${FREE_FINDINGS_LIMIT} of ${results.findings.length} Findings`
            : `Findings (${results.findings.length})`}
        </Text>

        {/* Table header */}
        <View style={styles.tableHeader}>
          <View style={styles.colSeverity}>
            <Text style={styles.thText}>Severity</Text>
          </View>
          <View style={styles.colCategory}>
            <Text style={styles.thText}>Area</Text>
          </View>
          <View style={styles.colTitle}>
            <Text style={styles.thText}>Finding & Recommendation</Text>
          </View>
          <View style={styles.colImpact}>
            <Text style={styles.thText}>Impact</Text>
          </View>
        </View>

        {/* Table rows */}
        {visibleFindings.map((finding, idx) => (
          <View
            key={finding.id}
            style={{
              ...styles.tableRow,
              ...(idx % 2 === 1 ? styles.tableRowAlt : {}),
            }}
            wrap={false}
          >
            <View style={styles.colSeverity}>
              <Text
                style={
                  finding.severity === "critical"
                    ? styles.badgeCritical
                    : finding.severity === "warning"
                      ? styles.badgeWarning
                      : styles.badgeInfo
                }
              >
                {finding.severity.toUpperCase()}
              </Text>
            </View>
            <View style={styles.colCategory}>
              <Text style={styles.cellText}>
                {getCategoryLabel(finding.category)}
              </Text>
            </View>
            <View style={styles.colTitle}>
              <Text style={styles.cellTitle}>{finding.title}</Text>
              <Text style={styles.cellRec}>
                {truncate(finding.recommendation, 120)}
              </Text>
            </View>
            <View style={styles.colImpact}>
              <View style={styles.impactBar}>
                <View
                  style={{
                    ...styles.impactFill,
                    width: `${finding.impactScore * 10}%`,
                    backgroundColor: impactColor(finding.impactScore),
                  }}
                />
              </View>
              <Text style={styles.impactText}>
                {finding.impactScore}/10
              </Text>
            </View>
          </View>
        ))}

        {/* Upgrade CTA for free users */}
        {hiddenCount > 0 && (
          <View
            style={{
              backgroundColor: "#f5f3ff",
              borderRadius: 6,
              padding: 16,
              marginTop: 12,
              alignItems: "center",
              border: "1px solid #ddd6fe",
            }}
            wrap={false}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Helvetica-Bold",
                color: "#7c3aed",
                marginBottom: 4,
              }}
            >
              +{hiddenCount} more findings available
            </Text>
            <Text
              style={{
                fontSize: 9,
                color: "#71717a",
                textAlign: "center",
              }}
            >
              Upgrade to a full audit to unlock all findings, detailed
              recommendations, and suggested copy rewrites.
            </Text>
            <Text
              style={{
                fontSize: 9,
                fontFamily: "Helvetica-Bold",
                color: "#7c3aed",
                marginTop: 6,
              }}
            >
              convertiq.com/pricing
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            ConvertIQ — Conversion Audit Report
          </Text>
          <Text style={styles.footerText}>
            Generated {date} | convertiq.com
          </Text>
        </View>
      </Page>
    </Document>
  );
}
