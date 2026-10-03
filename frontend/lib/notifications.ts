export type NotifCategory = "RIDE_REQUEST" | "RIDE_UPDATE" | "SAFETY" | "SYSTEM" | "RATING";

export interface AppNotification {
  id: number;
  category: NotifCategory;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

function getStorageKey(userEmail?: string): string {
  if (userEmail) {
    return `commuto_notifs_${userEmail.toLowerCase().trim()}`;
  }
  if (typeof window !== "undefined") {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.email) {
          return `commuto_notifs_${user.email.toLowerCase().trim()}`;
        }
      }
    } catch {
      // ignore
    }
  }
  return "commuto_notifs_guest";
}

export function getUserNotifications(userEmail?: string): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userEmail));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserNotifications(notifs: AppNotification[], userEmail?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(userEmail), JSON.stringify(notifs));
    window.dispatchEvent(new Event("commuto_notifications_updated"));
  } catch {
    // ignore
  }
}

export function addUserNotification(
  notif: Omit<AppNotification, "id" | "timestamp" | "read">,
  userEmail?: string
): void {
  const current = getUserNotifications(userEmail);
  const newNotif: AppNotification = {
    ...notif,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
  };
  // Prepend latest notification, cap at 50
  const updated = [newNotif, ...current].slice(0, 50);
  saveUserNotifications(updated, userEmail);
}

export function markNotificationAsRead(id: number, userEmail?: string): void {
  const current = getUserNotifications(userEmail);
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveUserNotifications(updated, userEmail);
}

export function markAllNotificationsAsRead(userEmail?: string): void {
  const current = getUserNotifications(userEmail);
  const updated = current.map((n) => ({ ...n, read: true }));
  saveUserNotifications(updated, userEmail);
}

export function getUnreadNotificationCount(userEmail?: string): number {
  const notifs = getUserNotifications(userEmail);
  return notifs.filter((n) => !n.read).length;
}
