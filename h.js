function getVisibleScaleInfo(startY, endY) {
  const results = [];

  document.querySelectorAll('*').forEach(el => {
    const style = window.getComputedStyle(el);
    const transform = style.transform;
    const scale = transform.match(/matrix\((.*?)\)/);

    if (!scale) return;

    const matrix = scale[1].split(',').map(Number);
    const s = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);

    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = rect.bottom + window.scrollY;

    if (top <= endY && bottom >= startY) {
      results.push({
        tag: el.tagName,
        text: (el.innerText || el.alt || '').trim().slice(0, 60),
        scale: Number(s.toFixed(4)),
        top: Math.round(top),
        bottom: Math.round(bottom),
      });
    }
  });

  return results;
}

function logScrollWindow(startY, endY) {
  const currentY = window.scrollY;
  console.log('scrollY:', currentY);
  console.log('window:', { startY, endY });
  console.table(getVisibleScaleInfo(startY, endY));
}

console.log('Scroll helper ready. Example: logScrollWindow(500, 1500);');