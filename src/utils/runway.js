import { withBaseUrl } from "./assets";

export const getRunwayImageUrls = (teamPageUrl, portfolioUrl) => {
  const memberName = portfolioUrl.replaceAll("-", "_");

  return [1, 2].map((lookNumber) =>
    withBaseUrl(
      `runway/${teamPageUrl}/${memberName}_runway_${lookNumber}.webp`
    )
  );
};
