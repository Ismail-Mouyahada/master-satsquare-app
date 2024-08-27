export async function fetchWalletDetails(walletId: string) {
    const response = await fetch(`https://lightning.ismail-mouyahada.com/api/v1/auth?usr=${walletId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error fetching wallet details from external API:', errorDetails);
      throw new Error(errorDetails);
    }
  
    return response.json();
  }