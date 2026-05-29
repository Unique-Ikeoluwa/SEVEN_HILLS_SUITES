export function calculateNights(
  checkIn?: Date,
  checkOut?: Date
): number {
  if (!checkIn || !checkOut) return 0;

  const diff = checkOut.getTime() - checkIn.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculateBookingTotal(
  pricePerNight: number,
  nights: number
) {
  const subtotal = pricePerNight * nights;

  const cleaningFee = 15000;
  const serviceFee = 10000;

  const total = subtotal + cleaningFee + serviceFee;

  return {
    subtotal,
    cleaningFee,
    serviceFee,
    total,
  };
}