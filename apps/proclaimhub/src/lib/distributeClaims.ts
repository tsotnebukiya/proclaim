import { Claim } from './createClaims';

const owners = [
  { name: 'Citi', acc: '25343', api: process.env.CITI_API! },
  { name: 'JP Morgan', acc: '93523', api: process.env.JP_API! },
  { name: 'Goldman', acc: '10343', api: process.env.GOLDMAN_API! },
  { name: 'Barclays', acc: '84632', api: process.env.BARCLAYS_API! },
  { name: 'BNY Mellon', acc: '45634', api: process.env.BNY_API! },
];

export const sendPromises = (groupedClaims: Record<string, Claim[]>) =>
  owners.map(async (el) => {
    const claims = groupedClaims[el.acc];
    if (claims && claims.length > 0) {
      try {
        const response = await fetch(el.api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(claims),
        });
        if (!response.ok) {
          console.error(
            `Failed to send claims for owner ${el.name}: ${response.statusText}`
          );
        }
      } catch (error) {
        console.error(`Error sending claims for owner ${el.name}:`, error);
      }
    } else {
      console.warn(`No claims found for owner ${el.name}, skipping.`);
    }
  });
