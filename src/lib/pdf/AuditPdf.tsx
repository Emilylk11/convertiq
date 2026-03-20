import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { AuditResults } from "@/lib/types";

// Use built-in Helvetica — no external font fetch needed
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#09090b",
    color: "#fafafa",
    fontFamily: "Helvetica",
    padding: 48,
    fontSize: 10,
  },
  // Header
  header: {
    marginBottom: 32,
    borderBottom: "1px solid #3f3f46",
    paddingBottom: 24,
  },
  logo: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#c084fc",
  },
  logoAccent: {
    color: "#a855f7",
  },
  headerUrl: {
    fontSize: 9,
    color: "#a1a1aa",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#fafafa",
    marginBottom: 6,
  },
  // Score section
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 24,
  },
  scoreBig: {
    fontSize: 48,
    fontFamily: "Helvetica-Bold",
  },
  scoreLabel: {
    fontSize: 9,
    color: "#a1a1aa",
    marginTop: 2,
  },
  summary: {
    flex: 1,
    fontSize: 10,
    color: "#a1a1aa",
    lineHeight: 1.6,
  },
  // Category scores
  categoryGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 28,
  },
  categoryBox: {
    flex: 1,
    backgroundColor: "#18181b",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    border: "1px solid #3f3f46",
  },
  categoryScore: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#fafafa",
  },
  categoryName: {
    fontSize: 8,
    color: "#a1a1aa",
    marginTop: 3,
    textTransform: "uppercase",
  },
  // Headlines section
  headlineBox: {
    backgroundColor: "#18181b",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    border: "1px solid #3f3f46",
  },
  headlineTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    color: "#c084fc",
  },
  headlineLabel: {
    fontSize: 8,
    color: "#a1a1aa",
    marginBottom: 3,
  },
  headlineText: {
    fontSize: 11,
    color: "#c084fc",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 10,
  },
  // Findings
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
    marginTop: 8,
    color: "#fafafa",
  },
  findingCard: {
    backgroundColor: "#18181b",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    border: "1px solid #3f3f46",
  },
  findingMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  badgeCritical: {
    backgroundColor: "#450a0a",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    color: "#f87171",
    fontFamily: "Helvetica-Bold",
  },
  badgeWarning: {
    backgroundColor: "#422006",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    color: "#fbbf24",
    fontFamily: "Helvetica-Bold",
  },
  badgeInfo: {
    backgroundColor: "#172554",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    color: "#60a5fa",
    fontFamily: "Helvetica-Bold",
  },
  findingCategory: {
    fontSize: 8,
    color: "#a1a1aa",
    fontFamily: "Courier",
  },
  findingImpact: {
    fontSize: 8,
    color: "#a1a1aa",
    marginLeft: "auto",
  },
  findingTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#fafafa",
  },
  findingDesc: {
    fontSize: 9,
    color: "#a1a1aa",
    lineHeight: 1.5,
    marginBottom: 8,
  },
  recBox: {
    backgroundColor: "#1a1025",
    borderRadius: 5,
    padding: 10,
    marginBottom: 6,
  },
  recLabel: {
    fontSize: 8,
    color: "#c084fc",
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  recText: {
    fontSize: 9,
    color: "#a1a1aa",
    lineHeight: 1.5,
  },
  copyBox: {
    backgroundColor: "#052e16",
    borderRadius: 5,
    padding: 10,
  },
  copyLabel: {
    fontSize: 8,
    color: "#4ade80",
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  copyText: {
    fontSize: 9,
    color: "#fafafa",
    fontFamily: "Helvetica-Oblique",
    lineHeight: 1.5,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    borderTop: "1px solid #3f3f46",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#52525b",
  },
});

const categoryLabels: Record<string, string> = {
  cta: "CTA",
  copy: "Copy",
  trust: "Trust",
  ux: "UX",
  speed: "Speed",
  mobile: "Mobile",
};

const CATEGORIES = ["cta", "copy", "trust", "ux", "speed", "mobile"] as const;

function scoreColor(score: number) {
  if (score >= 70) return "#4ade80";
  if (score >= 40) return "#facc15";
  return "#f87171";
}

export default function AuditPdf({
  results,
  url,
  createdAt,
}: {
  results: AuditResults;
  url: string;
  createdAt: string;
}) {
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
        <View style={styles.header}>
          <Text style={styles.logo}>ConvertIQ</Text>
          <Text style={styles.headerTitle}>Conversion Audit Report</Text>
          <Text style={styles.headerUrl}>{url}</Text>
          <Text style={{ ...styles.headerUrl, marginTop: 2 }}>
            Generated {date}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreRow}>
          <View>
            <Text
              style={{ ...styles.scoreBig, color: scoreColor(results.overallScore) }}
            >
              {results.overallScore}
            </Text>
            <Text style={styles.scoreLabel}>out of 100</Text>
          </View>
          <Text style={styles.summary}>{results.summary}</Text>
        </View>

        {/* Category scores */}
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <View key={cat} style={styles.categoryBox}>
              <Text
                style={{
                  ...styles.categoryScore,
                  color: scoreColor(results.categoryScores[cat]),
                }}
              >
                {results.categoryScores[cat]}
              </Text>
              <Text style={styles.categoryName}>{cat}</Text>
            </View>
          ))}
        </View>

        {/* Rewritten headlines */}
        {(results.rewrittenHeadline || results.rewrittenSubheadline) && (
          <View style={styles.headlineBox}>
            <Text style={styles.headlineTitle}>✦ Suggested headline rewrites</Text>
            {results.rewrittenHeadline && (
              <View style={{ marginBottom: 8 }}>
                <Text style={styles.headlineLabel}>Headline</Text>
                <Text style={styles.headlineText}>
                  &quot;{results.rewrittenHeadline}&quot;
                </Text>
              </View>
            )}
            {results.rewrittenSubheadline && (
              <View>
                <Text style={styles.headlineLabel}>Subheadline</Text>
                <Text style={{ ...styles.headlineText, color: "#fafafa" }}>
                  &quot;{results.rewrittenSubheadline}&quot;
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Findings */}
        <Text style={styles.sectionTitle}>Findings</Text>
        {results.findings.map((finding) => (
          <View key={finding.id} style={styles.findingCard} wrap={false}>
            <View style={styles.findingMeta}>
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
              <Text style={styles.findingCategory}>
                {categoryLabels[finding.category] || finding.category}
              </Text>
              <Text style={styles.findingImpact}>
                Impact: {finding.impactScore}/10
              </Text>
            </View>
            <Text style={styles.findingTitle}>{finding.title}</Text>
            <Text style={styles.findingDesc}>{finding.description}</Text>
            <View style={styles.recBox}>
              <Text style={styles.recLabel}>Recommendation</Text>
              <Text style={styles.recText}>{finding.recommendation}</Text>
            </View>
            {finding.rewrittenCopy && (
              <View style={{ ...styles.copyBox, marginTop: 6 }}>
                <Text style={styles.copyLabel}>Suggested copy</Text>
                <Text style={styles.copyText}>
                  &quot;{finding.rewrittenCopy}&quot;
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>ConvertIQ — convertiq.com</Text>
          <Text style={styles.footerText}>
            Report expires 90 days from generation
          </Text>
        </View>
      </Page>
    </Document>
  );
}
