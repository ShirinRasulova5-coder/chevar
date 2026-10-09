const CROQUIS_MODELS = [
  {
    id: "female",
    name: "Female (Ayol Modeli)",
    subtitle: "Klassik 9-boshli podium silueti",
    category: "Ayollar liboslari",
    viewBox: "0 0 400 800",
    svgPath: `
      <!-- Head and neck -->
      <ellipse cx="200" cy="70" rx="19" ry="26" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 194 95 Q 194 125 188 135 M 206 95 Q 206 125 212 135" fill="none" stroke="#64748b" stroke-width="1.6" />
      <!-- Shoulders & Collarbone -->
      <path d="M 188 135 C 160 138, 140 148, 130 152 M 212 135 C 240 138, 260 148, 270 152" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 175 142 Q 200 148 225 142" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="2,2" />
      <!-- Bust & Torso -->
      <path d="M 130 152 C 128 175, 142 205, 155 220 C 165 230, 168 250, 164 275" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 270 152 C 272 175, 258 205, 245 220 C 235 230, 232 250, 236 275" fill="none" stroke="#64748b" stroke-width="1.6" />
      <!-- Chest lines -->
      <path d="M 160 195 Q 180 215 200 210 Q 220 215 240 195" fill="none" stroke="#94a3b8" stroke-width="1.2" />
      <path d="M 200 140 L 200 275" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3" />
      <!-- Slender Waist & Hips -->
      <path d="M 164 275 C 158 310, 145 350, 148 385 C 150 415, 162 445, 165 470" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 236 275 C 244 305, 256 345, 254 385 C 252 415, 240 445, 237 470" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 164 275 Q 200 282 236 275" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="2,2" />
      <path d="M 148 375 Q 200 385 254 375" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="2,2" />
      <!-- Left Leg (Catwalk Runway pose) -->
      <path d="M 172 385 C 170 430, 172 490, 175 540 C 177 580, 173 630, 175 690 C 176 720, 173 745, 172 765" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 196 385 C 194 430, 192 485, 190 535 C 188 575, 191 625, 189 690 C 188 720, 184 745, 182 765" fill="none" stroke="#64748b" stroke-width="1.6" />
      <!-- Right Leg (Catwalk cross forward) -->
      <path d="M 204 385 C 206 430, 210 485, 212 535 C 214 575, 217 625, 222 690 C 224 720, 228 745, 230 765" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 230 385 C 232 430, 230 485, 228 535 C 226 575, 232 625, 238 690 C 240 720, 244 745, 246 765" fill="none" stroke="#64748b" stroke-width="1.6" />
      <!-- High-heeled feet -->
      <path d="M 172 765 L 174 785 L 180 782 L 182 765" fill="none" stroke="#64748b" stroke-width="1.4" />
      <path d="M 230 765 L 235 788 L 243 784 L 246 765" fill="none" stroke="#64748b" stroke-width="1.4" />
      <!-- Left Arm (Hand on waist / hip pose) -->
      <path d="M 130 152 C 115 185, 105 220, 115 255 C 122 280, 138 285, 160 278" fill="none" stroke="#64748b" stroke-width="1.5" />
      <path d="M 142 165 C 130 195, 120 225, 130 250 C 136 265, 148 272, 164 272" fill="none" stroke="#64748b" stroke-width="1.5" />
      <!-- Right Arm (Gracefully hanging down) -->
      <path d="M 270 152 C 282 195, 288 245, 286 295 C 285 330, 280 365, 276 395" fill="none" stroke="#64748b" stroke-width="1.5" />
      <path d="M 258 165 C 268 205, 272 250, 270 295 C 269 330, 266 365, 264 395" fill="none" stroke="#64748b" stroke-width="1.5" />
      <!-- Right Hand fingers -->
      <path d="M 276 395 C 274 415, 270 425, 268 430 M 264 395 C 265 415, 267 425, 268 430" fill="none" stroke="#64748b" stroke-width="1.3" />
    `
  },
  {
    id: "male",
    name: "Male (Erkak Modeli)",
    subtitle: "Baland bo'yli, keng yelkali qaddi-qomat",
    category: "Erkaklar kostyum va liboslari",
    viewBox: "0 0 400 800",
    svgPath: `
      <!-- Head -->
      <path d="M 184 55 C 184 40, 216 40, 216 55 C 216 75, 212 90, 208 100 L 192 100 C 188 90, 184 75, 184 55 Z" fill="none" stroke="#475569" stroke-width="1.8" />
      <!-- Neck -->
      <path d="M 190 100 L 186 130 M 210 100 L 214 130" fill="none" stroke="#475569" stroke-width="1.8" />
      <!-- Broad Shoulders -->
      <path d="M 186 130 C 150 134, 125 145, 110 155 M 214 130 C 250 134, 275 145, 290 155" fill="none" stroke="#475569" stroke-width="1.8" />
      <!-- Collar bone -->
      <path d="M 170 140 Q 200 148 230 140" fill="none" stroke="#94a3b8" stroke-width="1.2" />
      <!-- Athletic Torso & Chest -->
      <path d="M 110 155 C 114 195, 125 240, 140 285 L 146 335" fill="none" stroke="#475569" stroke-width="1.8" />
      <path d="M 290 155 C 286 195, 275 240, 260 285 L 254 335" fill="none" stroke="#475569" stroke-width="1.8" />
      <!-- Pectoral & Abs guide lines -->
      <path d="M 145 195 Q 170 210 200 205 Q 230 210 255 195" fill="none" stroke="#94a3b8" stroke-width="1.2" />
      <path d="M 200 135 L 200 335" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3" />
      <path d="M 152 285 Q 200 290 248 285" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="2,2" />
      <!-- Waist to Pelvis -->
      <path d="M 146 335 C 142 360, 145 385, 150 405" fill="none" stroke="#475569" stroke-width="1.8" />
      <path d="M 254 335 C 258 360, 255 385, 250 405" fill="none" stroke="#475569" stroke-width="1.8" />
      <path d="M 150 405 Q 200 420 250 405" fill="none" stroke="#94a3b8" stroke-width="1.2" />
      <!-- Left Leg (Straight Standing) -->
      <path d="M 160 410 C 158 460, 156 525, 160 580 C 163 620, 165 675, 168 735 L 168 765" fill="none" stroke="#475569" stroke-width="1.8" />
      <path d="M 194 415 C 190 460, 188 525, 188 580 C 187 620, 184 675, 182 735 L 182 765" fill="none" stroke="#475569" stroke-width="1.8" />
      <!-- Right Leg (Straight Standing) -->
      <path d="M 206 415 C 210 460, 212 525, 212 580 C 213 620, 216 675, 218 735 L 218 765" fill="none" stroke="#475569" stroke-width="1.8" />
      <path d="M 240 410 C 242 460, 244 525, 240 580 C 237 620, 235 675, 232 735 L 232 765" fill="none" stroke="#475569" stroke-width="1.8" />
      <!-- Feet -->
      <path d="M 168 765 L 164 785 L 184 785 L 182 765" fill="none" stroke="#475569" stroke-width="1.6" />
      <path d="M 218 765 L 216 785 L 236 785 L 232 765" fill="none" stroke="#475569" stroke-width="1.6" />
      <!-- Arms -->
      <path d="M 110 155 C 98 200, 94 250, 96 300 C 98 340, 106 380, 114 415" fill="none" stroke="#475569" stroke-width="1.6" />
      <path d="M 126 170 C 116 210, 114 250, 116 300 C 118 340, 124 380, 128 415" fill="none" stroke="#475569" stroke-width="1.6" />
      <path d="M 290 155 C 302 200, 306 250, 304 300 C 302 340, 294 380, 286 415" fill="none" stroke="#475569" stroke-width="1.6" />
      <path d="M 274 170 C 284 210, 286 250, 284 300 C 282 340, 276 380, 272 415" fill="none" stroke="#475569" stroke-width="1.6" />
      <!-- Hands -->
      <path d="M 114 415 L 112 445 L 126 445 L 128 415" fill="none" stroke="#475569" stroke-width="1.4" />
      <path d="M 286 415 L 288 445 L 274 445 L 272 415" fill="none" stroke="#475569" stroke-width="1.4" />
    `
  },
  {
    id: "kid-female",
    name: "Kid Female (Qiz Bola)",
    subtitle: "Chiroyli bolalar liboslari uchun mutanosib shakl",
    category: "Bolalar kiyimi",
    viewBox: "0 0 400 700",
    svgPath: `
      <!-- Big Cute Head -->
      <ellipse cx="200" cy="110" rx="36" ry="42" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 194 152 L 194 175 M 206 152 L 206 175" fill="none" stroke="#64748b" stroke-width="1.8" />
      <!-- Small Shoulders -->
      <path d="M 194 175 C 175 180, 155 190, 142 198 M 206 175 C 225 180, 245 190, 258 198" fill="none" stroke="#64748b" stroke-width="1.8" />
      <!-- Torso -->
      <path d="M 142 198 C 146 230, 152 265, 156 295" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 258 198 C 254 230, 248 265, 244 295" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 156 295 Q 200 305 244 295" fill="none" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="2,2" />
      <path d="M 200 175 L 200 350" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3" />
      <!-- Hips / Skirt guide -->
      <path d="M 156 295 C 150 330, 148 355, 152 380" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 244 295 C 250 330, 252 355, 248 380" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 152 380 Q 200 395 248 380" fill="none" stroke="#94a3b8" stroke-width="1.4" />
      <!-- Legs -->
      <path d="M 166 385 C 164 435, 166 490, 168 550 C 170 585, 172 615, 172 640" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 188 385 C 186 435, 186 490, 186 550 C 186 585, 185 615, 184 640" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 212 385 C 214 435, 214 490, 214 550 C 214 585, 215 615, 216 640" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 234 385 C 236 435, 234 490, 232 550 C 230 585, 228 615, 228 640" fill="none" stroke="#64748b" stroke-width="1.8" />
      <!-- Cute Shoes -->
      <path d="M 172 640 C 168 655, 172 665, 186 665 C 190 665, 188 655, 184 640" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 216 640 C 212 655, 210 665, 224 665 C 228 665, 232 655, 228 640" fill="none" stroke="#64748b" stroke-width="1.6" />
      <!-- Arms cute pose -->
      <path d="M 142 198 C 128 235, 120 270, 128 305 L 134 335" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 152 210 C 140 240, 136 270, 142 300 L 146 330" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 258 198 C 272 235, 280 270, 272 305 L 266 335" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 248 210 C 260 240, 264 270, 258 300 L 254 330" fill="none" stroke="#64748b" stroke-width="1.6" />
      <!-- Hands -->
      <circle cx="138" cy="345" r="7" fill="none" stroke="#64748b" stroke-width="1.4" />
      <circle cx="262" cy="345" r="7" fill="none" stroke="#64748b" stroke-width="1.4" />
    `
  },
  {
    id: "kid-male",
    name: "Kid Male (O'g'il Bola)",
    subtitle: "Bolalar kostyumlari va futbolkalari uchun andoza",
    category: "Bolalar kiyimi",
    viewBox: "0 0 400 700",
    svgPath: `
      <!-- Head -->
      <ellipse cx="200" cy="110" rx="35" ry="40" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 194 150 L 194 175 M 206 150 L 206 175" fill="none" stroke="#64748b" stroke-width="1.8" />
      <!-- Boyish Shoulders -->
      <path d="M 194 175 C 172 178, 150 188, 135 198 M 206 175 C 228 178, 250 188, 265 198" fill="none" stroke="#64748b" stroke-width="1.8" />
      <!-- Torso -->
      <path d="M 135 198 C 140 235, 146 270, 152 305 L 152 345" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 265 198 C 260 235, 254 270, 248 305 L 248 345" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 152 345 Q 200 355 248 345" fill="none" stroke="#94a3b8" stroke-width="1.4" />
      <path d="M 200 175 L 200 360" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3" />
      <!-- Legs (Straight standing casual) -->
      <path d="M 162 350 C 160 410, 158 475, 162 540 C 164 575, 166 610, 168 640" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 188 355 C 186 410, 184 475, 184 540 C 183 575, 182 610, 182 640" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 212 355 C 214 410, 216 475, 216 540 C 217 575, 218 610, 218 640" fill="none" stroke="#64748b" stroke-width="1.8" />
      <path d="M 238 350 C 240 410, 242 475, 238 540 C 236 575, 234 610, 232 640" fill="none" stroke="#64748b" stroke-width="1.8" />
      <!-- Sneakers -->
      <path d="M 168 640 L 162 665 L 186 665 L 182 640" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 218 640 L 214 665 L 238 665 L 232 640" fill="none" stroke="#64748b" stroke-width="1.6" />
      <!-- Arms -->
      <path d="M 135 198 C 122 235, 116 270, 122 310 L 126 345" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 148 210 C 136 240, 132 270, 136 305 L 140 340" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 265 198 C 278 235, 284 270, 278 310 L 274 345" fill="none" stroke="#64748b" stroke-width="1.6" />
      <path d="M 252 210 C 264 240, 268 270, 264 305 L 260 340" fill="none" stroke="#64748b" stroke-width="1.6" />
      <circle cx="132" cy="355" r="7" fill="none" stroke="#64748b" stroke-width="1.4" />
      <circle cx="268" cy="355" r="7" fill="none" stroke="#64748b" stroke-width="1.4" />
    `
  }
];
const FASHION_ELEMENTS = [
  // Bodice / Korset
  {
    id: "bodice_sweetheart",
    name: "Sweetheart Korset",
    category: "bodice",
    defaultPosition: { x: 130, y: 160, width: 140, height: 120 },
    svgPath: "M 0 30 Q 35 0 70 25 Q 105 0 140 30 L 125 115 Q 70 125 15 115 Z"
  },
  {
    id: "bodice_vneck",
    name: "Chuqur V-Yoqa Korset",
    category: "bodice",
    defaultPosition: { x: 130, y: 150, width: 140, height: 130 },
    svgPath: "M 0 0 L 70 80 L 140 0 L 126 125 Q 70 135 14 125 Z"
  },
  {
    id: "bodice_strapless",
    name: "Strapless To'g'ri Korset",
    category: "bodice",
    defaultPosition: { x: 135, y: 175, width: 130, height: 105 },
    svgPath: "M 0 0 Q 65 10 130 0 L 120 100 Q 65 110 10 100 Z"
  },
  // Shoulders & Sleeves
  {
    id: "sleeve_puff",
    name: "Puff Yeng (Volanli)",
    category: "shoulders",
    defaultPosition: { x: 95, y: 140, width: 210, height: 80 },
    svgPath: "M 0 35 C 5 5 45 0 45 40 C 45 60 20 65 0 35 M 210 35 C 205 5 165 0 165 40 C 165 60 190 65 210 35"
  },
  {
    id: "sleeve_offshoulder",
    name: "Off-Shoulder Draperiya",
    category: "shoulders",
    defaultPosition: { x: 110, y: 165, width: 180, height: 45 },
    svgPath: "M 0 10 Q 90 40 180 10 L 175 35 Q 90 55 5 35 Z"
  },
  // Necklines
  {
    id: "neck_collared",
    name: "Klassik Yoqa",
    category: "neckline",
    defaultPosition: { x: 165, y: 125, width: 70, height: 40 },
    svgPath: "M 0 10 L 35 35 L 70 10 L 55 0 L 35 15 L 15 0 Z"
  },
  {
    id: "neck_bow",
    name: "Bantikli Romantik Yoqa",
    category: "neckline",
    defaultPosition: { x: 170, y: 130, width: 60, height: 40 },
    svgPath: "M 30 15 C 10 0 0 15 20 20 C 0 30 15 40 30 25 C 45 40 60 30 40 20 C 60 15 50 0 30 15 Z"
  },
  // Skirts & Ruffles (Image 1 features tiered ruffles!)
  {
    id: "skirt_ruffle_tiers",
    name: "Qat-qat Volanli Etak (Ruffles)",
    category: "skirts",
    defaultPosition: { x: 90, y: 275, width: 220, height: 490 },
    svgPath: `
      <!-- Tier 1 -->
      M 60 0 Q 110 10 160 0 L 175 80 Q 110 110 45 80 Z
      <!-- Tier 2 -->
      M 45 75 Q 110 105 175 75 L 195 180 Q 110 220 25 180 Z
      <!-- Tier 3 -->
      M 25 175 Q 110 215 195 175 L 215 310 Q 110 360 5 310 Z
      <!-- Tier 4 Maxi -->
      M 5 305 Q 110 355 215 305 L 220 480 Q 110 500 0 480 Z
    `
  },
  {
    id: "skirt_aline",
    name: "Klassik A-Siluet Etak",
    category: "skirts",
    defaultPosition: { x: 110, y: 275, width: 180, height: 480 },
    svgPath: "M 45 0 Q 90 8 135 0 L 180 470 Q 90 490 0 470 Z"
  },
  {
    id: "skirt_fishtail",
    name: "Suvparisi / Mermaid Etak",
    category: "skirts",
    defaultPosition: { x: 120, y: 275, width: 160, height: 490 },
    svgPath: "M 35 0 Q 80 8 125 0 C 135 120 120 220 115 300 C 140 370 160 440 160 480 Q 80 495 0 480 C 0 440 20 370 45 300 C 40 220 25 120 35 0 Z"
  },
  // Accessories
  {
    id: "acc_hat",
    name: "Keng Hoshiyali Shlyapa",
    category: "accessories",
    defaultPosition: { x: 110, y: 30, width: 180, height: 70 },
    svgPath: "M 0 45 Q 90 20 180 45 Q 150 70 0 45 M 50 42 C 50 10 130 10 130 42"
  },
  {
    id: "acc_belt",
    name: "Keng Tilla Kamar",
    category: "accessories",
    defaultPosition: { x: 155, y: 270, width: 90, height: 25 },
    svgPath: "M 0 0 L 90 0 L 88 22 L 2 22 Z M 40 2 L 50 2 L 50 20 L 40 20 Z"
  }
];
const FASHION_PALETTE = [
  { name: "Burgundy Velvet", hex: "#7B1123" },
  { name: "Crimson Silk", hex: "#9E1B32" },
  { name: "Rose Chiffon", hex: "#E86F88" },
  { name: "Blush Satin", hex: "#F7CAC9" },
  { name: "Golden Adras", hex: "#D4AF37" },
  { name: "Champagne Shimmer", hex: "#F3E5AB" },
  { name: "Emerald Velour", hex: "#0B6623" },
  { name: "Mint Organza", hex: "#98FF98" },
  { name: "Royal Sapphire", hex: "#0F52BA" },
  { name: "Navy Brocade", hex: "#000080" },
  { name: "Lavender Tulle", hex: "#B57EDC" },
  { name: "Terracotta Clay", hex: "#C85A32" },
  { name: "Warm Ochre", hex: "#CC7722" },
  { name: "Jet Black Ink", hex: "#171717" },
  { name: "Graphite Charcoal", hex: "#374151" },
  { name: "Pure Silk White", hex: "#FFFFFF" }
];
export {
  CROQUIS_MODELS,
  FASHION_ELEMENTS,
  FASHION_PALETTE
};
