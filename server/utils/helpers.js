import Booking from '../models/Booking.js';
import { BOOKING_PREFIX } from '../config/constants.js';

export const generateBookingNumber = async () => {
    const year = new Date().getFullYear();
    const count = await Booking.countDocuments({
        createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
        }
    });
    
    return `${BOOKING_PREFIX}-${year}-${String(count + 1).padStart(4, '0')}`;
};
