export interface INotificaition {
    _id: string;
    title: string;
    body: string;
    image: string | null;
    receiver_type: NotificationReceiverType;
    type: NotificationType;
    center_id: string;
    createdAt: Date;
    updatedAt: Date;
}


export type NotificationReceiverType = "جميع الزبائن" | "داشبورد";

export type NotificationType = "اشعار" | "حجز" | "تسجل زبون جديد";
