import { ISortBy } from "../interface/sortBy.interface.";

export function web_sort_condition(sortBy: ISortBy[]): any {

    let sort_condition: any = {};

    // if key is num then convert to createdAt
    if (sortBy && sortBy.length >= 1) {
        sortBy.forEach((element: ISortBy) => {
            if (element.key === "num") {
                sort_condition["createdAt"] = element.order === "asc" ? 1 : -1;
            } else {
                sort_condition[element.key] = element.order === "asc" ? 1 : -1;
            }
        });
    } else {
        sort_condition = { createdAt: -1 };
    }
    return sort_condition;
}