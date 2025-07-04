
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import PageHeader from './padel/PageHeader';
import DateCard from './padel/DateCard';
import CourtCard from './padel/CourtCard';
import TimeCard from './padel/TimeCard';
import BookingSummary from './padel/BookingSummary';
import PartnerModal from './padel/PartnerModal';
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
        isBookingAlreadyOpen
    } = usePadelBooking();

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <PageHeader user={user} profile={profile} onSignOut={signOut} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <DateCard date={date} onDateChange={handleDateChange} />
                </div>
                
                <div className="space-y-6">
                    <CourtCard selectedCourt={selectedCourt} onCourtChange={setSelectedCourt} />
                    <TimeCard 
                        date={date}
                        startTime={startTime}
                        onStartTimeChange={setStartTime}
                    />

                    {startTime && date && (
                        <BookingSummary
                            date={date}
                            startTime={startTime}
                            selectedCourt={selectedCourt}
                            isBookingAlreadyOpen={isBookingAlreadyOpen}
                            reservationOpenDate={reservationOpenDate}
                            onOpenPartnerModal={handleInitiateBooking}
                        />
                    )}
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

            <PartnerModal 
                isOpen={isPartnerModalOpen}
                onOpenChange={setIsPartnerModalOpen}
                partners={partners}
                onPartnerChange={handlePartnerChange}
                onSubmit={submitBooking}
                isSubmitting={isSubmitting}
            />

            <UserBookingsList bookings={bookings} isLoading={isLoadingBookings} onCancelBooking={handleCancelBooking} />

             <footer className="text-center mt-12 text-sm text-muted-foreground">
                <p>Cette plateforme a été développée pour permettre aux copains d'Arkavia.fr d'accéder facilement aux réservations et de découvrir un cas d'usage, parmi tant d'autres, des agents autonomes propulsés par l'intelligence artificielle.</p>
            </footer>
        </div>
    );
}

export default PadelBooking;
