import { BehaviorSubject } from 'rxjs';
import apiClient from "../components/Keycloack/axios-client";



const notifications$ = new BehaviorSubject([]);

const REST_API_NOTIFICATION_BASE_URL = '/notification-service/api/v1/notifications';

const getNotifications = async () => {
  try {
    const res = await apiClient.get(REST_API_NOTIFICATION_BASE_URL);
    notifications$.next(res.data);
  } catch (err) {
    console.error('Erreur lors de la récupération des notifications:', err);
  }
};

const getUnreadCount = () => {
  return notifications$.getValue().filter((n) => !n.readValue).length;
};

const markAsRead = async (id) => {
  try {
    await apiClient.put(`${REST_API_NOTIFICATION_BASE_URL}/${id}`);
    const updated = notifications$.getValue().map((n) =>
      n.id === id ? { ...n, readValue: true } : n
    );
    notifications$.next(updated);
  } catch (err) {
    console.error('Erreur lors du marquage comme lu:', err);
  }
};

export default {
  notifications$,
  getNotifications,
  getUnreadCount,
  markAsRead,
  
};
