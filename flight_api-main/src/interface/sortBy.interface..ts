export interface ISortBy {
    key: string;
    order: ISortByOrder;
}


export type ISortByOrder = "asc" | "desc";