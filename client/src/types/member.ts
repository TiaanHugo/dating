export type Member = {
    id: string
    dateOfBirth: string
    imageUrl?: string
    displayName: string
    created: string
    lastActive: string
    gender: string
    description?: string
    city: string
    country: string
}

export type Photo = {
    id: number
    url: string
    publicId?: any
    memberId: string
}

export type Message = {
    id: number
    senderId: string
    senderDisplayName: string
    senderImageUrl: string
    content: string
    recipientId: string
}

export type EditableMember = {
    displayName?: string
    city?: string
    country?: string
    description?: string
}

export class MemberParams {
    gender?: string;
    minAge = 18;
    maxAge = 100;
    pageNumber = 1;
    pageSize = 5;
}