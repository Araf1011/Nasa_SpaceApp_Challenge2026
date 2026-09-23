/**
 * High-Resolution NASA Space Apps Challenge 2026 Certificate Generator
 * Draws a personalized award certificate on an HTML5 Canvas for instant download.
 */

export function generateExplorerCertificate(canvas, studentName, earnedBadgesCount = 6, totalBadgesCount = 6) {
  const ctx = canvas.getContext('2d');
  const width = 1600;
  const height = 1100;
  canvas.width = width;
  canvas.height = height;

  // 1. Deep Space Background Gradient
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 900);
  bgGrad.addColorStop(0, '#0a1435');
  bgGrad.addColorStop(0.6, '#060a1e');
  bgGrad.addColorStop(1, '#02030a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Starfield & Nebula Dust
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let i = 0; i < 200; i++) {
    const x = (Math.sin(i * 997) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 613) * 0.5 + 0.5) * height;
    const r = (i % 3) * 0.8 + 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Ornate Glowing Gold & Cyan Outer Borders
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // Corner Accent Tech Brackets
  const cornerSize = 40;
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 6;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(35, 35 + cornerSize);
  ctx.lineTo(35, 35);
  ctx.lineTo(35 + cornerSize, 35);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - 35 - cornerSize, 35);
  ctx.lineTo(width - 35, 35);
  ctx.lineTo(width - 35, 35 + cornerSize);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(35, height - 35 - cornerSize);
  ctx.lineTo(35, height - 35);
  ctx.lineTo(35 + cornerSize, height - 35);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - 35 - cornerSize, height - 35);
  ctx.lineTo(width - 35, height - 35);
  ctx.lineTo(width - 35, height - 35 - cornerSize);
  ctx.stroke();

  // 4. Header Badge / NASA Space Apps Emblem Text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#00e5ff';
  ctx.font = 'bold 24px monospace';
  ctx.letterSpacing = '6px';
  ctx.fillText('NASA SPACE APPS CHALLENGE 2026', width / 2, 110);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('CERTIFICATE OF COSMIC MASTERY', width / 2, 175);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'italic 20px serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('SOLAR SYSTEM HARDWARE & ROBOTIC EXPLORATION DIVISION', width / 2, 225);

  // Decorative Golden Divider
  const divGrad = ctx.createLinearGradient(width / 2 - 350, 0, width / 2 + 350, 0);
  divGrad.addColorStop(0, 'rgba(255, 215, 0, 0)');
  divGrad.addColorStop(0.5, 'rgba(255, 215, 0, 1)');
  divGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = divGrad;
  ctx.fillRect(width / 2 - 350, 255, 700, 3);

  // 5. Honoree Presentation
  ctx.fillStyle = '#a0aec0';
  ctx.font = '22px sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('THIS PRESTIGIOUS CITATION IS PROUDLY CONFERRED UPON', width / 2, 330);

  // Student Name
  ctx.fillStyle = '#00f0ff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 18;
  ctx.font = 'bold 64px "Space Grotesk", sans-serif';
  const nameToRender = (studentName && studentName.trim().length > 0) ? studentName.trim() : 'Junior Space Cadet';
  ctx.fillText(nameToRender, width / 2, 420);
  ctx.shadowBlur = 0; // reset

  // Commendation Statement
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '24px sans-serif';
  ctx.letterSpacing = '1px';
  const line1 = `for successfully exploring NASA's hardware relics across the Moon, Mars, and Deep Space,`;
  const line2 = `mastering the history of planetary exploration from Apollo to Voyager and Perseverance,`;
  const line3 = `and discovering how humanity's robotic footprints inspire future generations.`;

  ctx.fillText(line1, width / 2, 510);
  ctx.fillText(line2, width / 2, 550);
  ctx.fillText(line3, width / 2, 590);

  // 6. Mission Accomplishment Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
  ctx.lineWidth = 2;
  const boxW = 800;
  const boxH = 120;
  const boxX = (width - boxW) / 2;
  const boxY = 650;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 26px monospace';
  ctx.fillText(`★ MISSION BADGES EARNED: ${earnedBadgesCount} / ${totalBadgesCount} ★`, width / 2, 695);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px monospace';
  ctx.fillText('STATUS: QUALIFIED COSMIC DETECTIVE & HARDWARE ARCHAEOLOGIST', width / 2, 735);

  // 7. Signatures and Seal
  // Golden Seal
  const sealX = width / 2;
  const sealY = 880;
  ctx.save();
  ctx.translate(sealX, sealY);
  ctx.beginPath();
  ctx.arc(0, 0, 54, 0, Math.PI * 2);
  ctx.fillStyle = 'radial-gradient(circle, #ffe066 0%, #b8860b 100%)';
  ctx.fillStyle = '#d4af37';
  ctx.fill();
  ctx.strokeStyle = '#fff8dc';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#060a1e';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('OFFICIAL', 0, -18);
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('★ NASA ★', 0, 4);
  ctx.font = 'bold 13px monospace';
  ctx.fillText('SPACE APPS 2026', 0, 24);
  ctx.restore();

  // Left Signee: Flight Director
  const sigLeftX = width / 2 - 400;
  ctx.strokeStyle = '#4a5568';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sigLeftX - 160, 920);
  ctx.lineTo(sigLeftX + 160, 920);
  ctx.stroke();

  ctx.fillStyle = '#00e5ff';
  ctx.font = 'italic 28px "Caveat", cursive, serif';
  ctx.fillText('Gene Kranz / Antigravity Dir.', sigLeftX, 890);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px monospace';
  ctx.fillText('MISSION DIRECTORATE LEAD', sigLeftX, 945);

  // Right Signee: Date & Verification Token
  const sigRightX = width / 2 + 400;
  ctx.strokeStyle = '#4a5568';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sigRightX - 160, 920);
  ctx.lineTo(sigRightX + 160, 920);
  ctx.stroke();

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(currentDate, sigRightX, 895);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px monospace';
  ctx.fillText('DATE OF CERTIFICATION', sigRightX, 945);

  // Footer Verification Note
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '14px monospace';
  ctx.fillText('VERIFICATION HASH: 0xNASA-2026-RELICS-COSMIC-CHALLENGE // REPRODUCIBLE SCIENTIFIC CITATION', width / 2, 1030);
}
