import { create } from 'zustand';
import notificationService from '../services/notificationService';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import useAuthStore from './authStore';

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isConnected: false,
    stompClient: null,

    fetchNotifications: async () => {
        try {
            const data = await notificationService.getNotifications();
            set({
                notifications: data,
                unreadCount: data.filter(n => !n.read).length
            });
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    },

    markAsRead: async (id) => {
        try {
            await notificationService.markAsRead(id);
            set(state => {
                const updated = state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                );
                return {
                    notifications: updated,
                    unreadCount: updated.filter(n => !n.read).length
                };
            });
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    },

    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead();
            set(state => {
                const updated = state.notifications.map(n => ({ ...n, read: true }));
                return {
                    notifications: updated,
                    unreadCount: 0
                };
            });
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    },

    addNotification: (notification) => {
        set(state => {
            const updated = [notification, ...state.notifications];
            return {
                notifications: updated,
                unreadCount: updated.filter(n => !n.read).length
            };
        });
        // Optional: Trigger Toast here locally or use a useEffect in a component
    },

    connectWebSocket: () => {
        const { user } = useAuthStore.getState();
        if (!user || get().isConnected) return;

        const socket = new SockJS('http://localhost:8081/ws');
        const client = Stomp.over(socket);
        client.debug = null; // Disable debug logs

        client.connect({}, () => {
            set({ isConnected: true, stompClient: client });

            // Subscribe to User User Queue (if using convertAndSendToUser)
            // Or typically manually mapped: /topic/user/{id}
            client.subscribe(`/topic/user/${user.id}`, (message) => {
                const note = JSON.parse(message.body);
                get().addNotification(note);
            });

            // Subscribe to Role Topic
            if (user.role) {
                client.subscribe(`/topic/role/${user.role}`, (message) => {
                    const note = JSON.parse(message.body);
                    get().addNotification(note);
                });
            }

        }, (error) => {
            console.error('WebSocket Error:', error);
            set({ isConnected: false });
            // Retry logic could go here
        });
    },

    disconnectWebSocket: () => {
        const { stompClient } = get();
        if (stompClient) {
            stompClient.disconnect();
            set({ isConnected: false, stompClient: null });
        }
    }
}));

export default useNotificationStore;
