const naturalCompare = (a, b) => {
  const re = /(\d+)|(\D+)/g;

  const aParts = a.match(re) || [];
  const bParts = b.match(re) || [];

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || "";
    const bPart = bParts[i] || "";

    const aIsNumber = !isNaN(aPart);
    const bIsNumber = !isNaN(bPart);

    if (aIsNumber && bIsNumber) {
      const aNum = parseInt(aPart, 10);
      const bNum = parseInt(bPart, 10);
      if (aNum !== bNum) {
        return aNum - bNum;
      }
    } else if (aPart !== bPart) {
      return aPart < bPart ? -1 : 1;
    }
  }
  return 0;
};

export default naturalCompare;
