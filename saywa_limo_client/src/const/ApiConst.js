const BACKEND_BASE_URL = process.env.REACT_APP_BASE_URL;
// Image
export const IMAGE_BASE_URL = `${BACKEND_BASE_URL}/vehicle_images/`;
// Routes
export const GET_VEHICLE_LIST = `${BACKEND_BASE_URL}/api/vehicles/get_vehicle_list`;
export const GET_SINGLE_VEHICLE = `${BACKEND_BASE_URL}/api/vehicles/get_single_vehicle`;

// Create User
export const SIGNUP_WITH_EMAIL = `${BACKEND_BASE_URL}/api/customers/signup_with_email`;
export const SIGN_IN_WITH_GOOGLE = `${BACKEND_BASE_URL}/api/customers/signup_with_google`;
export const UPDATE_USER_PHONE = `${BACKEND_BASE_URL}/api/customers/update_user_phone`;
export const NEW_SIGNATURE = `${BACKEND_BASE_URL}/api/customers/new_signature`;
export const GET_CUSTOMER = `${BACKEND_BASE_URL}/api/customers/find_customer`;
export const UPDATE_CUSTOMER = `${BACKEND_BASE_URL}/api/customers/update_customer_profile`;
// export const UPDATE_CUSTOMER = `${BACKEND_BASE_URL}/api/customers/update_customer`;
export const CHECK_EXIST_USER = `${BACKEND_BASE_URL}/api/customers/checkexist_db`;

// Trips
export const NEW_TRIP = `${BACKEND_BASE_URL}/api/trip/new_trip`;
export const GET_TRIP_DATA = `${BACKEND_BASE_URL}/api/trip/get_trip`;
export const CANCEL_TRIP_DATA = `${BACKEND_BASE_URL}/api/trip/cancel-trip`;
export const SINGLE_TRIP_DATA = `${BACKEND_BASE_URL}/api/trip/get_single_trips`;
export const TRIP_COUNT = `${BACKEND_BASE_URL}/api/trip/trip-count`;
// Payments
export const CHECKOUT_ACTION = `${BACKEND_BASE_URL}/api/payments/create-checkout-session`;
export const UPDATE_PAYMENT_INFO = `${BACKEND_BASE_URL}/api/trip/update-payment`;

export const UPLOAD = `${BACKEND_BASE_URL}/api/upload`;

// Referal
export const NEW_REFERAL_URL = `${BACKEND_BASE_URL}/api/referal/new-referal`;
export const GET_ALL_OFFERS_URL = `${BACKEND_BASE_URL}/api/referal/get-offers`;

// Wallet
export const GET_WALLET_BALANCE = `${BACKEND_BASE_URL}/api/customers/get-wallet-balance`;

// Packages

export const PACKAGES_URL = `${BACKEND_BASE_URL}/api/packages`;
