
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import PageHeader from './padel/PageHeader';
import BookingWizard from './padel/BookingWizard';
import UserBookingsList from './padel/UserBookingsList';
import RacingCredentialsModal from './padel/RacingCredentialsModal';
import { usePadelBooking } from '@/hooks/usePadelBooking';

const PadelBooking = () => {
    const { 
        user, 
        signOut,
        profile,
        date,
        handleDateChange,
        startTime,
        setStartTime,
        selectedCourt,
        setSelectedCourt,
        isSubmitting,
        partners,
        handlePartnerChange,
        isPartnerModalOpen,
        setIsPartnerModalOpen,
        isRacingModalOpen,
        setIsRacingModalOpen,
        racingIdInput,
        setRacingIdInput,
        racingPasswordInput,
        setRacingPasswordInput,
        bookings,
        isLoadingBookings,
        handleCancelBooking,
        handleInitiateBooking,
        handleRacingCredentialsSubmit,
        submitBooking,
        reservationOpenDate,
        isBookingAlreadyOpen,
        getFilteredTimeSlots,
        isLoadingSlots,
        handleWizardSubmit,
    } = usePadelBooking();

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header fixe */}
            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="container mx-auto p-4 max-w-4xl">
                    <PageHeader user={user} profile={profile} onSignOut={signOut} />
                </div>
            </div>

            {/* Contenu principal scrollable */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-4 max-w-2xl">
                    <div className="space-y-8">
                        <BookingWizard
                            date={date}
                            onDateChange={handleDateChange}
                            selectedCourt={selectedCourt}
                            onCourtChange={setSelectedCourt}
                            startTime={startTime}
                            onStartTimeChange={setStartTime}
                            availableSlots={getFilteredTimeSlots()}
                            isLoadingSlots={isLoadingSlots}
                            partners={partners}
                            onPartnerChange={handlePartnerChange}
                            onSubmit={handleWizardSubmit}
                            isBookingAlreadyOpen={isBookingAlreadyOpen}
                            reservationOpenDate={reservationOpenDate}
                        />

                        <UserBookingsList 
                            bookings={bookings} 
                            isLoading={isLoadingBookings} 
                            onCancelBooking={handleCancelBooking} 
                        />
                    </div>
                </div>
            </div>

            {/* Footer fixe */}
            <div className="sticky bottom-0 bg-background border-t">
                <div className="container mx-auto p-4 max-w-4xl">
                    <footer className="text-center text-sm text-muted-foreground">
                        <p>Cette plateforme a été développée pour permettre aux copains d'Arkavia.fr d'accéder facilement aux réservations</p>
                    </footer>
                </div>
            </div>

            <RacingCredentialsModal
                isOpen={isRacingModalOpen}
                onOpenChange={setIsRacingModalOpen}
                racingId={racingIdInput}
                setRacingId={setRacingIdInput}
                racingPassword={racingPasswordInput}
                setRacingPassword={setRacingPasswordInput}
                onSubmit={handleRacingCredentialsSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}

export default PadelBooking;
