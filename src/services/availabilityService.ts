
export type TimeSlot = {
  time: string;
  available: boolean;
};

// Ceci est une fonction de simulation. Dans une application réelle, vous récupéreriez ces données
// depuis votre backend, qui pourrait utiliser Playwright ou une autre méthode pour scraper le site de réservation.
export const fetchAvailability = async (date: Date, courtId: string): Promise<TimeSlot[]> => {
  console.log(`Fetching availability for ${date.toDateString()} on court ${courtId}...`);

  // Simuler une latence réseau
  await new Promise(resolve => setTimeout(resolve, 500));

  // Générer les créneaux de 07:00 à 21:00
  const slots: TimeSlot[] = [];
  for (let hour = 7; hour <= 21; hour++) {
    slots.push({
      time: `${String(hour).padStart(2, '0')}:00`,
      // Disponibilité simulée : pour la démo, certains créneaux sont indisponibles aléatoirement.
      available: Math.random() > 0.3, // 70% de chance d'être disponible
    });
  }
  
  // Rendre certains créneaux spécifiques indisponibles pour la démonstration
  // en fonction du terrain
  let unavailableSlots: string[] = [];
  switch (courtId) {
    case '1':
      unavailableSlots = ['12:00', '19:00', '20:00'];
      break;
    case '2':
      unavailableSlots = ['11:00', '18:00', '21:00'];
      break;
    case '3':
      unavailableSlots = ['09:00', '13:00', '17:00'];
      break;
    default:
      unavailableSlots = ['12:00', '19:00', '20:00'];
  }

  slots.forEach(slot => {
      if (unavailableSlots.includes(slot.time)) {
          slot.available = false;
      }
  });


  console.log(`Fetched slots for court ${courtId}:`, slots);
  return slots;
};
