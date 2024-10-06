


export function formatDate(dateString) {
    // Create a new Date object from the yyyy-mm-dd string
    const date = new Date(dateString);
  
    // Use Intl.DateTimeFormat to format the date
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  
    return formattedDate;
  }