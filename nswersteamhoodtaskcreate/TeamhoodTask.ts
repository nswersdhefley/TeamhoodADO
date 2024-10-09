export interface TeamhoodCustomField {
    name: string,
    value: string,
}

export interface TeamhoodTask {
    title: string,
    boardId?: string,
    assignedUserId?: string,
    ownerId?: string,
    rowId?: string,
    statusId?: string,
    startDate?: string,
    dueDate?: string,
    color?: number,
    description?: string,
    budget?: number,
    estimation?: number,
    completed?: boolean,
    workspaceId?: string,
    milestone?: boolean,
    progress?: number,
    isSuspended?: boolean,
    suspendReason?: string,
    parentId?: string,
    customFields?: TeamhoodCustomField[],
    tags?: string[]
    requestId?: string
}