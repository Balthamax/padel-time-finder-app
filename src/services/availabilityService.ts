
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

  const slots: TimeSlot[] = [];

  // Générer les créneaux en fonction du terrain
  if (courtId === '2') {
    // Padel 2: créneaux de 1h de 8h à 21h
    for (let hour = 8; hour <= 21; hour++) {
      slots.push({
        time: `${String(hour).padStart(2, '0')}:00`,
        available: Math.random() > 0.3, // 70% de chance d'être disponible
      });
    }
  } else if (courtId === '3') {
    // Padel 3: créneaux de 1h30 de 7h à 21h30
    // Les créneaux commencent à 7:00, 8:30, 10:00, ..., jusqu'à 20:30
    const startTimeInMinutes = 7 * 60;
    const endTimeInMinutes = 20 * 60 + 30; // Le dernier créneau commence à 20:30
    const slotDurationInMinutes = 90;

    for (let minutes = startTimeInMinutes; minutes <= endTimeInMinutes; minutes += slotDurationInMinutes) {
        const hour = Math.floor(minutes / 60);
        const min = minutes % 60;
        slots.push({
            time: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
            available: Math.random() > 0.3, // 70% de chance d'être disponible
        });
    }
  } else {
    // Padel 1 (et par défaut): créneaux de 1h de 7h à 21h
    for (let hour = 7; hour <= 21; hour++) {
      slots.push({
        time: `${String(hour).padStart(2, '0')}:00`,
        available: Math.random() > 0.3, // 70% de chance d'être disponible
      });
    }
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
      // Les créneaux pour le Padel 3 sont 7:00, 8:30, 10:00, 11:30, etc.
      unavailableSlots = ['10:00', '13:00', '17:30'];
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
