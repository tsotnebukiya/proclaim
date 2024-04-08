import { Claim } from "./createClaims";
import { owners } from "./owners";

export const sendPromises = (groupedClaims: Record<string, Claim[]>) =>
  owners.map(async (el) => {
    const claims = groupedClaims[el.acc];
    if (claims && claims.length > 0) {
      try {
        const response = await fetch(`${el.api}/engine/dummyclaims`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(claims),
        });
        if (!response.ok) {
          console.error(
            `Failed to send claims for owner ${el.name}: ${response.statusText}`,
          );
        }
      } catch (error) {
        console.error(`Error sending claims for owner ${el.name}:`, error);
      }
    } else {
      console.warn(`No claims found for owner ${el.name}, skipping.`);
    }
  });
