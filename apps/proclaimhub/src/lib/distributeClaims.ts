import { Claim } from "./createClaims";
import { accounts } from "./owners";

export const sendPromises = (groupedClaims: Record<string, Claim[]>) =>
  accounts.map(async (el) => {
    const claims = groupedClaims[el.name];
    if (claims && claims.length > 0) {
      try {
        const response = await fetch(
          `${el.api}/api/engine/claims/dummyclaims`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(claims),
          },
        );
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
