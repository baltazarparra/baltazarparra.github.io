/* Generated from docs/design-tokens.json. Do not edit. */
export const tokens = {
  "color": {
    "canvas": "#0C0D0F",
    "surface": "#15171A",
    "surfaceRaised": "#1D2024",
    "text": "#F2F0EA",
    "textMuted": "#AAA9A4",
    "line": "#34363B",
    "accent": "#E65B2F",
    "accentStrong": "#FF7448",
    "onAccent": "#0C0D0F"
  },
  "type": {
    "family": {
      "display": "Instrument Sans, Arial, sans-serif",
      "body": "Instrument Sans, Arial, sans-serif"
    },
    "weight": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "size": {
      "hero": "clamp(4rem, 10vw, 9rem)",
      "display": "clamp(3rem, 7vw, 7rem)",
      "heading": "clamp(2rem, 4vw, 4.5rem)",
      "lead": "clamp(1.5rem, 2.5vw, 2.75rem)",
      "body": "clamp(1rem, 1.2vw, 1.25rem)"
    },
    "lineHeight": {
      "display": 0.9,
      "heading": 0.98,
      "body": 1.45
    },
    "tracking": {
      "display": "-0.045em",
      "body": "-0.015em"
    }
  },
  "space": {
    "unit": "0.5rem",
    "sectionDesktop": "10rem",
    "sectionTablet": "6rem",
    "sectionMobile": "4rem",
    "gutterDesktop": "clamp(2rem, 4vw, 5rem)",
    "gutterMobile": "1.25rem"
  },
  "layout": {
    "maxWidth": "100rem",
    "gridColumns": 12,
    "breakpointMobile": "48rem",
    "breakpointWide": "90rem"
  },
  "shape": {
    "radius": "0px",
    "rule": "1px",
    "focus": "2px"
  },
  "motion": {
    "duration": {
      "fast": "160ms",
      "medium": "520ms",
      "slow": "900ms",
      "headerEnter": "560ms",
      "heroEnter": "720ms",
      "heroObject": "920ms",
      "settle": "780ms",
      "mediaCut": "950ms",
      "thermalCut": "650ms"
    },
    "easing": {
      "cut": "cubic-bezier(0.16, 1, 0.3, 1)",
      "entranceGsap": "power3.out",
      "maskGsap": "power4.inOut",
      "linear": "linear"
    },
    "stagger": {
      "copy": "70ms",
      "list": "60ms"
    },
    "scrub": {
      "thermal": "350ms",
      "project": "450ms",
      "media": "500ms"
    },
    "touch": "no pin; settle and cut only",
    "lowCapacity": "opacity and short translate only; static media"
  },
  "layer": {
    "content": 0,
    "nav": 10,
    "focus": 20
  }
} as const;
