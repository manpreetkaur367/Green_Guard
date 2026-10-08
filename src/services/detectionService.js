async function extractImageGPS(file) {
  try {
    if (typeof EXIF !== "undefined") {
      return await new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          EXIF.getData(img, function () {
            const lat = EXIF.getTag(this, "GPSLatitude");
            const latRef = EXIF.getTag(this, "GPSLatitudeRef");
            const lon = EXIF.getTag(this, "GPSLongitude");
            const lonRef = EXIF.getTag(this, "GPSLongitudeRef");
            if (lat && lon) {
              function toDeg(t) {
                if (!Array.isArray(t)) return null;
                const [d, m, s] = t;
                return d + m / 60 + s / 3600;
              }
              let latitude = toDeg(lat);
              let longitude = toDeg(lon);
              if (latitude && longitude) {
                if (latRef === "S") latitude = -latitude;
                if (lonRef === "W") longitude = -longitude;
                resolve({ lat: latitude, lng: longitude });
                URL.revokeObjectURL(url);
                return;
              }
            }
            resolve(null);
            URL.revokeObjectURL(url);
          });
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });
    }
  } catch (e) {}
  return null;
}

async function callDetectionApi(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/detections/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Detection analysis failed");
  }

  return response.json();
}

function simpleImageHeuristics(fileName) {
  const n = fileName.toLowerCase();
  if (n.includes("blur") || n.includes("dark") || n.includes("unclear") || n.includes("corrupt")) return "unclear";
  const treeWords = ["tree", "trees", "forest", "wood", "stump", "timber", "log", "branch"];
  const cuttingWords = ["cut", "cutting", "chainsaw", "axe", "chainsaw", "saw"];
  const irrelevant = ["laptop", "phone", "car", "food", "building", "selfie", "person", "street"];
  if (treeWords.some((w) => n.includes(w))) {
    if (cuttingWords.some((w) => n.includes(w))) return "cutting";
    return "tree";
  }
  if (cuttingWords.some((w) => n.includes(w))) return "cutting";
  if (irrelevant.some((w) => n.includes(w))) return "irrelevant";
  return "irrelevant";
}

export async function analyzeImage(file) {
  try {
    return await callDetectionApi(file);
  } catch (e) {}

  const gps = await extractImageGPS(file);
  const kind = simpleImageHeuristics(file.name || "");
  if (kind === "unclear") {
    return {
      relevant: false,
      activity_detected: false,
      risk_level: "NONE",
      risk_score: 0,
      detections: [],
      message: "Insufficient visual evidence. Demo analysis.",
      gps: gps || null,
    };
  }
  if (kind === "irrelevant") {
    return {
      relevant: false,
      activity_detected: false,
      risk_level: "NONE",
      risk_score: 0,
      detections: [],
      message: "No tree-related activity detected. Demo analysis.",
      gps: gps || null,
    };
  }
  if (kind === "tree") {
    return {
      relevant: true,
      activity_detected: false,
      risk_level: "LOW",
      risk_score: 10,
      detections: [{ label: "tree", confidence: 92 }],
      message: "Tree / Forest detected — no clear cutting evidence. Demo analysis.",
      gps: gps || null,
    };
  }
  return {
    relevant: true,
    activity_detected: true,
    risk_level: "HIGH",
    risk_score: 82,
    detections: [
      { label: "stump", confidence: 0.91 * 100 },
      { label: "timber", confidence: 0.88 * 100 },
      { label: "person", confidence: 0.84 * 100 },
    ],
    message: "Possible tree-cutting activity detected — demo analysis. Connect real model for authoritative results.",
    gps: gps || null,
  };
}

export default { analyzeImage };
