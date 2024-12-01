const BACKEND_BASE_URL = process.env.REACT_APP_BASE_URL;

// Image
export const IMAGE_BASE_URL = `${BACKEND_BASE_URL}/vehicle_images/`;

// Clients
export const ALL_CLIENTS = `${BACKEND_BASE_URL}/api/customers/list_customers`;
export const ALL_CLIENTS_COUNTS = `${BACKEND_BASE_URL}/api/customers/live-customers-count`;
export const CLIENT_UPDATE = `${BACKEND_BASE_URL}/api/customers/client-update`;
export const LOAD_CLIENT_DATA = `${BACKEND_BASE_URL}/api/trip/get_client_trips`;
export const LIVE_CUSTOMER = `${BACKEND_BASE_URL}/api/customers/live_search_customers`;
export const SIGNUP_WITH_EMAIL = `${BACKEND_BASE_URL}/api/customers/signup_with_email`;
export const ADMIN_SIGNUP_WITH_EMAIL = `${BACKEND_BASE_URL}/api/customers/admin_signup_with_email`;
export const TRIP_COUNT = `${BACKEND_BASE_URL}/api/trip/trip-count`;
export const DELETE_USER = `${BACKEND_BASE_URL}/api/trip/delete-user`;
// User Users
export const LOGIN = `${BACKEND_BASE_URL}/api/login`;
export const CHECKUSERNAME = `${BACKEND_BASE_URL}/api/users/check_user_name`;
export const ADDUSER = `${BACKEND_BASE_URL}/api/users/add_user`;
export const UPDATEUSER = `${BACKEND_BASE_URL}/api/users/update_user`;
export const GETUSERS = `${BACKEND_BASE_URL}/api/users/all_users`;
export const GET_ALL_USERS = `${BACKEND_BASE_URL}/api/users/get_all_users`;
export const TOGGLESTATUS = `${BACKEND_BASE_URL}/api/users/toggle_status`;
export const GETSINGLEUSER = `${BACKEND_BASE_URL}/api/users/get_single_user`;

// Vehicle Routes
export const ADDVEHICLE = `${BACKEND_BASE_URL}/api/vehicles/add_vehicle`;
export const GETVEHICLE = `${BACKEND_BASE_URL}/api/vehicles/get_vehicle`;
export const GET_VEHICLE_LIST = `${BACKEND_BASE_URL}/api/vehicles/get_vehicle_list`;
export const GET_SINGLE_VEHICLE = `${BACKEND_BASE_URL}/api/vehicles/get_single_vehicle`;
export const DELETE_VEHICLE_IMAGE = `${BACKEND_BASE_URL}/api/vehicles/delete_image`;
export const UPDATE_VEHICLE = `${BACKEND_BASE_URL}/api/vehicles/update_vehicle`;
export const UPDATE_VEHICLE_IMAGE = `${BACKEND_BASE_URL}/api/vehicles/update_image`;
export const ALL_VEHICLE_COUNT = `${BACKEND_BASE_URL}/api/vehicles/vehicle-count`;
export const UPDATE_VEHICLE_BASE_DISTANCE_URL = `${BACKEND_BASE_URL}/api/vehicles/update-base-distance`;
export const UPDATE_VEHICLE_BASE_DISTANCE_PRICE_URL = `${BACKEND_BASE_URL}/api/vehicles/update-distance-unit-price`;
export const UPDATE_VEHICLE_BASE_DISTANCE_OR_PRICE_PRICE_URL = `${BACKEND_BASE_URL}/api/vehicles/update-price-distance`;
export const LIVE_SEARCH_VEHICLE_URL = `${BACKEND_BASE_URL}/api/vehicles/live-search`;

// Trips
export const NEW_ADMIN_TRIP = `${BACKEND_BASE_URL}/api/trip/new_admin_trips`;
export const GET_PENDING_TRIPS = `${BACKEND_BASE_URL}/api/trip/get_unassigned_trips`;
export const GET_TRIP_DATA = `${BACKEND_BASE_URL}/api/trip/get_all_trips`;
export const GET_SINGLE_TRIP_DATA = `${BACKEND_BASE_URL}/api/trip/get_single_trips`;
export const UPDATE_TRIP_DRIVER = `${BACKEND_BASE_URL}/api/trip/update_driver`;
export const VARIFY_TRIP = `${BACKEND_BASE_URL}/api/trip/varify-content`;
export const CANCEL_TRIP = `${BACKEND_BASE_URL}/api/trip/cancel-trip`;
export const SEND_STATUS = `${BACKEND_BASE_URL}/api/trip/send-status`;

export const TOTAL_TRIPS = `${BACKEND_BASE_URL}/api/trip/trips-count`;
export const LAST_FIVE_TRIPS = `${BACKEND_BASE_URL}/api/trip/last-five-trips`;

// Trips - Filter
export const ALL_TRIP = `${BACKEND_BASE_URL}/api/trip/get_all_trips`;
export const UNASSIGNEDTRIPS = `${BACKEND_BASE_URL}/api/trip/get_unassigned_trips`;
export const UNASSIGNED_TRIPS_NEW_URL = `${BACKEND_BASE_URL}/api/trip/get_unassigned_trips_new`;
export const UPDATE_STATUS = `${BACKEND_BASE_URL}/api/trip/update-trips`;

// Notifications
export const GET_NOTIFICATIONS = `${BACKEND_BASE_URL}/api/notifications/get_admin_notifications`;

export const GET_DRIVERS_LIST = `${BACKEND_BASE_URL}/api/users/users_list`;

export const SEND_PAYMENT = `${BACKEND_BASE_URL}/api/trip/send-payment-link`;

export const PACKAGES_URL = `${BACKEND_BASE_URL}/api/packages`;
